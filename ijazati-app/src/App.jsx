import React from 'react';
import { storeGet, storeSet, defaultLeaveTypes } from './utils/helpers.js';

const getDefaultSettings = () => ({
  salary: '',
  currency: 'SAR',
  dailyHours: '8',
  workType: 'single',
  morningStart: '08:00',
  morningEnd: '12:00',
  afternoonStart: '16:00',
  afternoonEnd: '20:00',
  monthStart: 26,
  monthEnd: 25,
  compensatoryDays: 0,
  weekendDays: [5, 6],
  monthlyLeave: 2.5,
  carryOverPolicy: 'max30',
  calculationMethod: 'current'
});

const App = () => {
  const [currentPage, setCurrentPage] = React.useState('home');
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [userData, setUserData] = React.useState(storeGet('userData', null));
  const [settings, setSettings] = React.useState(storeGet('settings', getDefaultSettings()));
  const [leaves, setLeaves] = React.useState(storeGet('leaves', []));
  const [earlyLeaves, setEarlyLeaves] = React.useState(storeGet('earlyLeaves', []));
  const [lateArrivals, setLateArrivals] = React.useState(storeGet('lateArrivals', []));
  const [balanceData, setBalanceData] = React.useState(storeGet('balanceData', {}));
  const [leaveTypes, setLeaveTypes] = React.useState(storeGet('leaveTypes', defaultLeaveTypes));
  const [activities, setActivities] = React.useState(storeGet('activities', []));
  
  const [toasts, setToasts] = React.useState([]);
  const [fabOpen, setFabOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(null);

  // إضافة إشعار
  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // حفظ البيانات
  const saveData = (key, data) => {
    storeSet(key, data);
    addActivity(`تم حفظ ${key}`);
  };

  // إضافة سجل نشاط
  const addActivity = (description) => {
    const activity = {
      id: Date.now(),
      description,
      timestamp: new Date().toISOString()
    };
    const newActivities = [activity, ...activities].slice(0, 300);
    setActivities(newActivities);
    saveData('activities', newActivities);
  };

  // تحديث البيانات
  const handleRefresh = () => {
    addToast('تم تحديث البيانات', 'success');
  };

  // حذف البيانات
  const handleDelete = () => {
    if (window.confirm('هل أنت متأكد من حذف جميع البيانات؟')) {
      localStorage.clear();
      setUserData(null);
      setSettings(getDefaultSettings());
      setLeaves([]);
      setEarlyLeaves([]);
      setLateArrivals([]);
      setBalanceData({});
      setLeaveTypes(defaultLeaveTypes);
      setActivities([]);
      addToast('تم حذف جميع البيانات', 'success');
    }
  };

  // التنقل بين الصفحات
  const handlePageChange = (page) => {
    setCurrentPage(page);
    setFabOpen(false);
  };

  // معالجة اختيار FAB
  const handleFabSelect = (type) => {
    setFabOpen(false);
    switch (type) {
      case 'leave':
        setCurrentPage('leave');
        break;
      case 'early':
        setCurrentPage('early');
        break;
      case 'late':
        setCurrentPage('late');
        break;
      default:
        break;
    }
  };

  // عرض الصفحة الحالية
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div style={{ padding: '20px' }}>
            <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '700' }}>
              الصفحة الرئيسية
            </h2>
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              <p>مرحباً بك في تطبيق إجازتي</p>
              <p style={{ marginTop: '8px', fontSize: '14px' }}>
                {userData ? `أهلاً ${userData.fullName}` : 'يرجى إدخال بياناتك أولاً'}
              </p>
            </div>
          </div>
        );
      
      case 'userdata':
        return (
          <div style={{ padding: '20px' }}>
            <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '700' }}>بياناتي</h2>
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              <p>صفحة بيانات المستخدم</p>
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div style={{ padding: '20px' }}>
            <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '700' }}>الإعدادات</h2>
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              <p>صفحة الإعدادات</p>
            </div>
          </div>
        );
      
      default:
        return (
          <div style={{ padding: '20px' }}>
            <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '700' }}>
              {currentPage}
            </h2>
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              <p>قيد التطوير...</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="app">
      {/* الشريط العلوي */}
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
            onClick={() => setSidebarOpen(true)}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              color: 'white',
              fontSize: '20px'
            }}
          >
            ☰
          </button>
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>
            إجازتي
          </h1>
        </div>
        <div style={{ fontSize: '24px' }}>📅</div>
      </div>

      {/* المحتوى الرئيسي */}
      <main>{renderPage()}</main>

      {/* زر الإضافة العائم */}
      {currentPage === 'home' && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          zIndex: 90
        }}>
          {fabOpen && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginBottom: '12px'
            }}>
              <button
                onClick={() => handleFabSelect('leave')}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '20px',
                  boxShadow: '0 4px 8px rgba(99, 102, 241, 0.3)'
                }}
              >
                🏖️
              </button>
              <button
                onClick={() => handleFabSelect('early')}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'var(--warning)',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '20px',
                  boxShadow: '0 4px 8px rgba(245, 158, 11, 0.3)'
                }}
              >
                🚶
              </button>
              <button
                onClick={() => handleFabSelect('late')}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '20px',
                  boxShadow: '0 4px 8px rgba(249, 115, 22, 0.3)'
                }}
              >
                ⏰
              </button>
            </div>
          )}
          <button
            onClick={() => setFabOpen(!fabOpen)}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontSize: '28px',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
              transition: 'transform 0.3s ease',
              transform: fabOpen ? 'rotate(45deg)' : 'rotate(0deg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            +
          </button>
        </div>
      )}

      {/* القائمة الجانبية */}
      {sidebarOpen && (
        <>
          <div 
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 200
            }}
          />
          <div 
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              width: '280px',
              height: '100vh',
              backgroundColor: 'var(--bg-card)',
              zIndex: 201,
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
              {[
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
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    handlePageChange(item.id);
                    setSidebarOpen(false);
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
                    borderRight: currentPage === item.id ? '3px solid var(--primary)' : '3px solid transparent'
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            {/* أزرار الإجراءات */}
            <div style={{ padding: '16px', borderTop: '1px solid var(--border)' }}>
              <button
                onClick={handleRefresh}
                style={{
                  width: '100%',
                  padding: '12px',
                  marginBottom: '8px',
                  borderRadius: 'var(--radius-md)',
                  border: '2px solid var(--primary)',
                  background: 'transparent',
                  color: 'var(--primary)',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                🔄 تحديث البيانات
              </button>
              <button
                onClick={handleDelete}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: 'var(--danger)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                🗑️ حذف البيانات
              </button>
            </div>
          </div>
        </>
      )}

      {/* الإشعارات */}
      {toasts.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          right: '20px',
          zIndex: 2000,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          maxWidth: '480px',
          margin: '0 auto'
        }}>
          {toasts.map((toast) => (
            <div
              key={toast.id}
              style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                background: toast.type === 'success' ? '#ecfdf5' : 
                           toast.type === 'error' ? '#fef2f2' : 
                           toast.type === 'warning' ? '#fffbeb' : '#eff6ff',
                borderRight: `4px solid ${
                  toast.type === 'success' ? 'var(--success)' : 
                  toast.type === 'error' ? 'var(--danger)' : 
                  toast.type === 'warning' ? 'var(--warning)' : 'var(--info)'
                }`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '14px',
                color: 'var(--text-primary)'
              }}
            >
              <span>{toast.message}</span>
              <button
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  padding: '4px',
                  fontSize: '18px'
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
