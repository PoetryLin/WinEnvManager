import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, ArrowUp, ArrowDown, List, Type } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const EditModal = ({ isOpen, onClose, onSave, initialData }) => {
    const { t } = useLanguage();
    const [name, setName] = useState('');
    const [value, setValue] = useState('');
    const [target, setTarget] = useState('User');

    const [isListMode, setIsListMode] = useState(false);
    const [listItems, setListItems] = useState([]);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setName(initialData.Name);
                setValue(initialData.Value);
                setTarget(initialData.Target);

                // Auto-detect list mode if value contains semicolons
                if (initialData.Value && initialData.Value.includes(';')) {
                    setIsListMode(true);
                    setListItems(initialData.Value.split(';').filter(item => item.trim() !== ''));
                } else {
                    setIsListMode(false);
                    setListItems([]);
                }
            } else {
                setName('');
                setValue('');
                setTarget('User');
                setIsListMode(false);
                setListItems([]);
            }
        }
    }, [isOpen, initialData]);

    // Sync listItems back to value string whenever listItems change
    useEffect(() => {
        if (isListMode) {
            setValue(listItems.join(';'));
        }
    }, [listItems, isListMode]);

    // Sync value string back to listItems if we switch to list mode manually
    const handleModeToggle = () => {
        if (!isListMode) {
            // Switching TO list mode
            setListItems(value.split(';').filter(item => item.trim() !== ''));
        }
        setIsListMode(!isListMode);
    };

    const handleListItemChange = (index, newValue) => {
        const newItems = [...listItems];
        newItems[index] = newValue;
        setListItems(newItems);
    };

    const addListItem = () => {
        setListItems([...listItems, '']);
    };

    const removeListItem = (index) => {
        const newItems = listItems.filter((_, i) => i !== index);
        setListItems(newItems);
    };

    const moveItem = (index, direction) => {
        if (direction === 'up' && index > 0) {
            const newItems = [...listItems];
            [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
            setListItems(newItems);
        } else if (direction === 'down' && index < listItems.length - 1) {
            const newItems = [...listItems];
            [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
            setListItems(newItems);
        }
    };

    const handleSave = () => {
        // Final sync just in case
        const finalValue = isListMode ? listItems.join(';') : value;
        onSave(name, finalValue, target);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 relative animate-fade-in">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                    {initialData ? t('editTitle') : t('createTitle')}
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('nameLabel')}
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={!!initialData} // Usually name key is primary, maybe allow edit if we delete old one? Simpler to disable for now or treat as replace.
                            // Let's allow editing name for "new", but maybe for check safety we keep it. If editing, we overwrite.
                            // Actually Windows env vars are Key-Value. If you change key, it's a new var.
                            // For simplicity, let's allow editing Name, but it will create a new one if changed and old one remains unless we handle rename.
                            // Let's Keep it simple: treat as upsert.
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder={t('example')}
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('valueLabel')}
                            </label>
                            <button
                                onClick={handleModeToggle}
                                className="flex items-center space-x-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                {isListMode ? <Type size={14} /> : <List size={14} />}
                                <span>{isListMode ? t('textEdit') : t('listEdit')}</span>
                            </button>
                        </div>

                        {isListMode ? (
                            <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar border border-gray-200 dark:border-gray-700 rounded-md p-2 bg-gray-50 dark:bg-gray-900">
                                {listItems.length === 0 && (
                                    <div className="text-center text-sm text-gray-400 py-4">
                                        {t('emptyList')}
                                    </div>
                                )}
                                {listItems.map((item, index) => (
                                    <div key={index} className="flex items-center space-x-2 animate-fade-in-up">
                                        <div className="flex-none flex flex-col space-y-1">
                                            <button
                                                onClick={() => moveItem(index, 'up')}
                                                disabled={index === 0}
                                                className="text-gray-400 hover:text-blue-500 disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                <ArrowUp size={12} />
                                            </button>
                                            <button
                                                onClick={() => moveItem(index, 'down')}
                                                disabled={index === listItems.length - 1}
                                                className="text-gray-400 hover:text-blue-500 disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                <ArrowDown size={12} />
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            value={item}
                                            onChange={(e) => handleListItemChange(index, e.target.value)}
                                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            placeholder={t('valuePlaceholder')}
                                        />
                                        <button
                                            onClick={() => removeListItem(index)}
                                            className="text-red-400 hover:text-red-600 p-1"
                                            title={t('deleteItem')}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={addListItem}
                                    className="w-full mt-2 flex items-center justify-center space-x-1 py-1 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors text-sm"
                                >
                                    <Plus size={16} />
                                    <span>{t('addItem')}</span>
                                </button>
                            </div>
                        ) : (
                            <textarea
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white h-32 font-mono text-sm"
                                placeholder={t('valuePlaceholderText')}
                            />
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('scopeLabel')}
                        </label>
                        <select
                            value={target}
                            onChange={(e) => setTarget(e.target.value)}
                            disabled={!!initialData} // Usually we don't move vars between scopes easily without deleting. Keep disabled for edit.
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                            <option value="User">{t('userScopeOption')}</option>
                            <option value="Machine">{t('systemScopeOption')}</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">{t('systemWarning')}</p>
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                        {t('cancel')}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!name}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {t('save')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditModal;
