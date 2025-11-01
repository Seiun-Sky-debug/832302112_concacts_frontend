<template>
  <el-container class="app-container">
    <el-header class="app-header"> 前后端分离通讯录 (Vue + FastAPI) </el-header>
    <el-main>
      <div class="toolbar">
        <el-button type="primary" :icon="Plus" @click="openAddDialog"> 添加联系人 </el-button>
        <el-select
          v-model="selectedGroup"
          placeholder="按分组筛选"
          clearable
          style="margin-left: 20px; width: 200px"
        >
          <el-option v-for="group in groupList" :key="group" :label="group" :value="group" />
        </el-select>
      </div>

      <el-table :data="filteredContacts" v-loading="loading" style="width: 100%; margin-top: 20px">
        <el-table-column label="姓名" width="200">
          <template #default="scope">
            <el-icon v-if="scope.row.is_pinned" color="#E6A23C" style="vertical-align: middle">
              <StarFilled />
            </el-icon>
            <span style="margin-left: 5px">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="电话" />
        <el-table-column label="分组" width="120">
          <template #default="scope">
            <el-tag v-if="scope.row.group" type="info" size="small">{{ scope.row.group }}</el-tag>
            <span v-else style="color: #909399">未分组</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="260">
          <template #default="scope">
            <el-button
              size="small"
              :icon="Star"
              :type="scope.row.is_pinned ? 'warning' : ''"
              @click="togglePin(scope.row)"
            >
              {{ scope.row.is_pinned ? '取消置顶' : '置顶' }}
            </el-button>
            <el-button size="small" :icon="Edit" @click="openEditDialog(scope.row)">
              修改
            </el-button>
            <el-button
              size="small"
              type="danger"
              :icon="Delete"
              @click="handleDelete(scope.row._id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>

  <el-dialog
    v-model="dialogVisible"
    :title="isEdit ? '修改联系人' : '添加新联系人'"
    width="450px"
    @close="resetForm"
  >
    <el-form :model="contactForm" label-width="80px">
      <el-form-item label="姓名">
        <el-input v-model="contactForm.name" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="contactForm.phone" placeholder="请输入电话号码" />
      </el-form-item>
      <el-form-item label="分组">
        <el-select
          v-model="contactForm.group"
          placeholder="选择或创建分组"
          filterable
          allow-create
          default-first-option
          clearable
          style="width: 100%"
        >
          <el-option v-for="group in groupList" :key="group" :label="group" :value="group" />
        </el-select>
      </el-form-item>
      <el-form-item label=" ">
        <el-checkbox v-model="contactForm.is_pinned" label="将此联系人置顶" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">
        {{ isEdit ? '保存修改' : '立即添加' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete, Star, StarFilled } from '@element-plus/icons-vue'
import axios from 'axios'

// 状态变量
const contacts = ref([])
const loading = ref(true)
const dialogVisible = ref(false)
const isEdit = ref(false)
const currentContactId = ref(null)
const groupList = ref([])
const selectedGroup = ref('')

const API_URL = '/api/contacts'

// 表单数据
const contactForm = reactive({
  name: '',
  phone: '',
  group: null,
  is_pinned: false,
})

// 计算属性：过滤后的联系人
const filteredContacts = computed(() => {
  if (!selectedGroup.value) {
    return contacts.value
  }
  return contacts.value.filter((c) => c.group === selectedGroup.value)
})

// API: 获取分组列表
async function fetchGroups() {
  try {
    const response = await axios.get(`${API_URL}/groups`)
    groupList.value = response.data
  } catch (error) {
    console.error('获取分组列表失败', error)
  }
}

// API: 获取所有联系人
async function fetchContacts() {
  loading.value = true
  try {
    const response = await axios.get(`${API_URL}/`)
    contacts.value = response.data
    await fetchGroups() // 同时更新分组列表
  } catch (error) {
    ElMessage.error('获取联系人列表失败')
  } finally {
    loading.value = false
  }
}

// API: 创建联系人
async function createContact() {
  try {
    await axios.post(`${API_URL}/`, contactForm)
    ElMessage.success('添加成功')
    fetchContacts()
    dialogVisible.value = false
  } catch (error) {
    ElMessage.error('添加失败，请检查输入')
  }
}

// API: 更新联系人
async function updateContact() {
  if (!currentContactId.value) return
  try {
    await axios.put(`${API_URL}/${currentContactId.value}`, contactForm)
    ElMessage.success('修改成功')
    fetchContacts()
    dialogVisible.value = false
  } catch (error) {
    ElMessage.error('修改失败')
  }
}

// API: 删除联系人
async function handleDelete(id) {
  try {
    await ElMessageBox.confirm('您确定要删除这位联系人吗?', '警告', {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning',
    })

    await axios.delete(`${API_URL}/${id}`)
    ElMessage.success('删除成功')
    fetchContacts()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// API: 切换置顶
async function togglePin(contact) {
  const newPinState = !contact.is_pinned
  try {
    await axios.put(`${API_URL}/${contact._id}/pin`, { is_pinned: newPinState })
    ElMessage.success(newPinState ? '已置顶' : '已取消置顶')
    fetchContacts()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 表单相关
function resetForm() {
  contactForm.name = ''
  contactForm.phone = ''
  contactForm.group = null
  contactForm.is_pinned = false
  currentContactId.value = null
}

function openAddDialog() {
  isEdit.value = false
  resetForm()
  dialogVisible.value = true
}

function openEditDialog(contact) {
  isEdit.value = true
  // 注意：这里不能直接 resetForm() 然后赋值，因为 contactForm 是 reactive 的
  // resetForm()
  contactForm.name = contact.name
  contactForm.phone = contact.phone
  contactForm.group = contact.group
  contactForm.is_pinned = contact.is_pinned
  currentContactId.value = contact._id
  dialogVisible.value = true
}

function handleSubmit() {
  if (isEdit.value) {
    updateContact()
  } else {
    createContact()
  }
}

// onMounted 钩子
onMounted(() => {
  fetchContacts()
})
</script>

<style scoped>
.app-container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}
.app-header {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  padding: 20px 0;
  border-bottom: 1px solid #dcdfe6;
}
.toolbar {
  margin-top: 20px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}
</style>
