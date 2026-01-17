import React, { useState, useEffect } from 'react';
import { Search, Plus, RefreshCw, Moon, Sun } from 'lucide-react';
import { getVariables, saveVariable, deleteVariable } from './api';
import VariableTable from './components/VariableTable';
import EditModal from './components/EditModal';

function App() {
  const [variables, setVariables] = useState([]);
  const [filteredVariables, setFilteredVariables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingVariable, setEditingVariable] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initial load
  useEffect(() => {
    fetchVariables();
    // Check system preference for dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Search filter effect
  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = variables.filter(v =>
      v.Name.toLowerCase().includes(lowerQuery) ||
      (v.Value && v.Value.toLowerCase().includes(lowerQuery))
    );
    setFilteredVariables(filtered);
  }, [searchQuery, variables]);

  const fetchVariables = async () => {
    setLoading(true);
    try {
      const data = await getVariables();
      // Sort: User vars first, then alphabetically
      const sorted = data.sort((a, b) => {
        if (a.Target === b.Target) {
          return a.Name.localeCompare(b.Name);
        }
        return a.Target === 'User' ? -1 : 1;
      });
      setVariables(sorted);
    } catch (error) {
      console.error("Failed to fetch variables", error);
      alert("加载环境变量失败，请确保后端服务正在运行。\nError: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (variable) => {
    setEditingVariable(variable);
    setIsEditModalOpen(true);
  };

  const handleCreate = () => {
    setEditingVariable(null);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (variable) => {
    if (window.confirm(`确定要删除 ${variable.Target} 变量 "${variable.Name}" 吗？此操作不可逆！`)) {
      try {
        await deleteVariable(variable.Name, variable.Target);
        fetchVariables();
      } catch (error) {
        alert("删除失败: " + error.response?.data?.error || error.message);
      }
    }
  };

  const handleSave = async (name, value, target) => {
    try {
      await saveVariable(name, value, target);
      fetchVariables();
    } catch (error) {
      alert("保存失败: " + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Windows 环境变量管理器
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              安全地管理您的系统和用户环境变量
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={fetchVariables}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              title="刷新"
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="搜索变量名或值..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>
          <button
            onClick={handleCreate}
            className="w-full md:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus size={20} />
            <span>新建变量</span>
          </button>
        </div>

        {/* Table */}
        <VariableTable
          variables={filteredVariables}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <div className="mt-4 text-center text-gray-500 dark:text-gray-400 text-sm">
          共显示 {filteredVariables.length} 个变量
        </div>
      </div>

      {/* Modal */}
      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSave}
        initialData={editingVariable}
      />
    </div>
  );
}

export default App;
