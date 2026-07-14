import React, { useState } from 'react';
import { storeSet, isWeekendDay, hasLeaveOnDate } from '../utils/helpers';

const LateArrivalPage = ({ userData, settings, lateArrivals, leaves, onSave, onCancel, addToastContainer, addActivity }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'late',
    date: '',
    time: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'العنوان مطلوب';
    }
    if (!formData.date) {
      newErrors.date = 'التاريخ مطلوب';
    }
    if (!formData.time) {
      newErrors.time = 'الوقت مطلوب';
    }

    // التحقق من وجود إجازة في نفس اليوم
    if (formData.date && hasLeaveOnDate(formData.date, leaves)) {
      newErrors.conflict = 'يوجد إجازة مسجلة في هذا اليوم';
    }

    // التحقق من أنه ليس يوم إجازة أسبوعية
    if (formData.date) {
      const dateObj = new Date(formData.date);
      if (isWeekendDay(dateObj.getDay(), settings.weekendDays)) {
        newErrors.weekend = 'هذا اليوم هو إجازة أسبوعية';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newLateArrival = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString()
    };

    const updatedLateArrivals = [...lateArrivals, newLateArrival];
    storeSet('lateArrivals', updatedLateArrivals);
    addActivity(`تم تسجيل إذن تأخير: ${formData.title}`);
    addToast('تم تسجيل إذن التأخير بنجاح', 'success');
    onSave?.();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '700' }}>تسجيل إذن تأخير</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>العنوان</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              border: errors.title ? '2px solid var(--danger)' : '2px solid var(--border)',
              fontSize: '14px',
              fontFamily: 'Tajawal, sans-serif'
            }}
            placeholder="مثال: زحمة مرور"
          />
          {errors.title && <p style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '4px' }}>{errors.title}</p>}
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>التاريخ</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              border: errors.date ? '2px solid var(--danger)' : '2px solid var(--border)',
              fontSize: '14px',
              fontFamily: 'Tajawal, sans-serif'
            }}
          />
          {errors.date && <p style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '4px' }}>{errors.date}</p>}
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>وقت الوصول</label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              border: errors.time ? '2px solid var(--danger)' : '2px solid var(--border)',
              fontSize: '14px',
              fontFamily: 'Tajawal, sans-serif'
            }}
          />
          {errors.time && <p style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '4px' }}>{errors.time}</p>}
        </div>

        {(errors.conflict || errors.weekend) && (
          <div style={{
            padding: '12px',
            background: '#fef2f2',
            borderRight: '4px solid var(--danger)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '16px'
          }}>
            {errors.conflict && <p style={{ color: 'var(--danger)', fontSize: '13px', margin: '0 0 8px 0' }}>{errors.conflict}</p>}
            {errors.weekend && <p style={{ color: 'var(--danger)', fontSize: '13px', margin: 0 }}>{errors.weekend}</p>}
          </div>
        )}

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>ملاحظات</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows="3"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              border: '2px solid var(--border)',
              fontSize: '14px',
              fontFamily: 'Tajawal, sans-serif',
              resize: 'vertical'
            }}
            placeholder="ملاحظات إضافية..."
          />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="submit"
            style={{
              flex: 1,
              padding: '14px',
              background: 'linear-gradient(135deg, var(--accent) 0%, #ea580c 100%)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            حفظ التأخير
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '14px',
              background: 'var(--bg-hover)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              color: 'var(--text-primary)'
            }}
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
};

export default LateArrivalPage;
