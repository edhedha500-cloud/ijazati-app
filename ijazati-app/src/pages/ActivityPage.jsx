import React from 'react';

const ActivityPage = ({ activities }) => {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionIcon = (description) => {
    if (description.includes('حفظ')) return '💾';
    if (description.includes('إجازة')) return '🏖️';
    if (description.includes('انصراف')) return '🚶';
    if (description.includes('تأخير')) return '⏰';
    if (description.includes('حذف')) return '🗑️';
    if (description.includes('تحديث')) return '🔄';
    if (description.includes('بيانات')) return '👤';
    if (description.includes('إعدادات')) return '⚙️';
    return '📝';
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '700' }}>سجل النشاط</h2>

      {activities.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: 'var(--text-muted)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
          <p style={{ fontSize: '16px', fontWeight: '500' }}>لا يوجد نشاط مسجل بعد</p>
          <p style={{ fontSize: '14px', marginTop: '8px' }}>ستظهر جميع العمليات هنا</p>
        </div>
      ) : (
        <>
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              إجمالي السجلات: {activities.length}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              الحد الأقصى: 300 سجل
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activities.map((activity, index) => (
              <div
                key={activity.id}
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start',
                  borderRight: index === 0 ? '4px solid var(--primary)' : '4px solid transparent',
                  animation: index === 0 ? 'fadeIn 0.3s ease' : 'none'
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'var(--bg-hover)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  flexShrink: 0
                }}>
                  {getActionIcon(activity.description)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    margin: '0 0 8px 0',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'var(--text-primary)'
                  }}>
                    {activity.description}
                  </p>
                  <p style={{
                    margin: 0,
                    fontSize: '12px',
                    color: 'var(--text-muted)'
                  }}>
                    {formatDate(activity.timestamp)}
                  </p>
                </div>
                {index === 0 && (
                  <span style={{
                    padding: '4px 12px',
                    background: 'var(--primary)',
                    color: 'white',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '11px',
                    fontWeight: '600',
                    whiteSpace: 'nowrap'
                  }}>
                    جديد
                  </span>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ActivityPage;
