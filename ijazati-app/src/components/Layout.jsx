import React from 'react';
import { Button } from './Common';

const TopBar = ({ title, onMenuClick }) => {
  return (
    <div style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
      color: 'white'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onMenuClick}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '8px',
            padding: '8px',
            cursor: 'pointer',
            color: 'white',
            fontSize: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ☰
        </button>
        <h1 style={{
          margin: 0,
          fontSize: '18px',
          fontWeight: '700'
        }}>
          {title}
        </h1>
      </div>
      <div style={{ fontSize: '24px' }}>📅</div>
    </div>
  );
};

const Sidebar = ({ isOpen, onClose, currentPage, onPageChange, userData, onRefresh, onDelete }) => {
  const menuItems = [
    { id: 'home', label: 'الصفحة الرئيسية', icon: '🏠' },
    { id: 'userdata', label: 'بياناتي', icon: '👤' },
    { id: 'leave', label: 'تسجيل إجازة', icon: '🏖️' },
    { id: 'early', label: 'إذن انصراف', icon: '🚶' },
    { id: 'late', label: 'إذن تأخير', icon: '⏰' },
    { id: 'balance', label: 'رصيد الإجازات', icon: '💳' },
    { id: 'reports', label: 'التقارير', icon: '📊' },
    { id: 'calculator', label: 'حاسبة الخصميات', icon: '🧮' },
    { id: 'activity', label: 'سجل النشاط', icon: '📝' },
    { id: 'settings', label: 'الإعدادات', icon: '⚙️' }
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 200,
            animation: 'fadeIn 0.3s ease'
          }}
        />
      )}
      <div 
        className={`sidebar ${isOpen ? 'open' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          right: isOpen ? 0 : '-100%',
          width: '280px',
          height: '100vh',
          backgroundColor: 'var(--bg-card)',
          zIndex: 201,
          transition: 'right 0.3s ease',
          boxShadow: '-4px 0 12px rgba(0,0,0,0.1)',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* رأس القائمة */}
        <div style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
          padding: '24px 20px',
          color: 'white'
        }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            borderRadius: '50%', 
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            marginBottom: '12px'
          }}>
            👤
          </div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '700' }}>
            {userData?.fullName || 'مستخدم جديد'}
          </h3>
          <p style={{ margin: 0, fontSize: '13px', opacity: 0.9 }}>
            {userData?.phone || 'لم يتم إضافة رقم الهاتف'}
          </p>
        </div>

        {/* عناصر القائمة */}
        <nav style={{ flex: 1, padding: '16px 0' }}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onPageChange(item.id);
                onClose();
              }}
              style={{
                width: '100%',
                padding: '14px 20px',
                border: 'none',
                background: currentPage === item.id ? 'var(--bg-hover)' : 'transparent',
                color: currentPage === item.id ? 'var(--primary)' : 'var(--text-primary)',
                fontSize: '14px',
                fontWeight: currentPage === item.id ? '700' : '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s ease',
                borderRight: currentPage === item.id ? '3px solid var(--primary)' : '3px solid transparent'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== item.id) {
                  e.target.style.background = 'var(--bg-hover)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== item.id) {
                  e.target.style.background = 'transparent';
                }
              }}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* أزرار الإجراءات */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--border)' }}>
          <Button
            variant="outline"
            fullWidth
            size="sm"
            onClick={onRefresh}
            style={{ marginBottom: '8px' }}
          >
            🔄 تحديث البيانات
          </Button>
          <Button
            variant="danger"
            fullWidth
            size="sm"
            onClick={onDelete}
          >
            🗑️ حذف البيانات
          </Button>
        </div>
      </div>
    </>
  );
};

export { TopBar, Sidebar };
