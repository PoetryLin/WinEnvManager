import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const VariableTable = ({ variables, onEdit, onDelete }) => {
    const { t } = useLanguage();

    return (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/4">
                            {t('tableName')}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/2">
                            {t('tableValue')}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-24">
                            {t('tableScope')}
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            {t('tableAction')}
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {variables.map((variable) => (
                        <tr key={`${variable.Target}-${variable.Name}`} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                {variable.Name}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 break-all">
                                <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                    {(variable.Value && variable.Value.includes(';')) ? (
                                        <div className="flex flex-col space-y-1">
                                            {variable.Value.split(';').filter(Boolean).map((part, idx) => (
                                                <span
                                                    key={idx}
                                                    className="inline-block px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-mono break-all"
                                                >
                                                    {part}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        variable.Value
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${variable.Target === 'User'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                                    }`}>
                                    {variable.Target === 'User' ? t('userScope') : t('systemScope')}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => onEdit(variable)}
                                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                                    title={t('edit')}
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => onDelete(variable)}
                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                    title={t('delete')}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {variables.length === 0 && (
                        <tr>
                            <td colSpan="4" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                                {t('noVariables')}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default VariableTable;
