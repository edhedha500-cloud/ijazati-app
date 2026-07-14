import React, { useState, useEffect } from 'react';
import { storeGet, storeSet, validateLeaveOverlap, isWeekendDay, getLeaveTypeById } from '../utils/helpers';

const LeaveFormPage = ({ userData, settings, leaves, earlyLeaves, lateArrivals, leaveTypes, onSave, onCancel, addToastContainer, addActivity }) => {
  const [formData, setFormData] = useState({
    title: '',
    leaveTypeId: '',
    startDate: '',
    endDate: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [showAddType, setShowAddType] = useState(false);
  const [newLeaveType, setNewLeaveType] = useState({ name: '', deductsFromBalance: true });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'العنوان مطلوب';
    }
    if (!formData.leaveTypeId) {
      newErrors.leaveTypeId = 'نوع الإجازة مطلوب';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'تاريخ البداية مطلوب';
    }
    if (!formData.endDate) {
      newErrors.endDate = 'تاريخ النهاية مطلوب';
    }
    if (formData.startDate > formData.endDate) {
      newErrors.endDate = 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية';
    }

    // التحقق من التداخل
    if (formData.startDate && formData.endDate) {
      const overlap = validateLeaveOverlap(formData.startDate, formData.endDate, leaves, null);
      if (overlap) {
        newErrors.dateRange = 'هناك تداخل مع إجازة أخرى مسجلة';
      }
    }

    // التحقق من أيام الأسبوع
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        if (isWeekendDay(d.getDay(), settings.weekendDays)) {
          newErrors.weekend = `يوم ${d.toLocaleDateString('ar-EG', { weekday: 'long' })} هو إجازة أسبوعية`;
          break;
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newLeave = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString()
    };

    const updatedLeaves = [...leaves, newLeave];
    saveData('leaves', updatedLeaves);
    addActivity(`تم تسجيل إجازة جديدة: ${formData.title}`);
    addToast('تم تسجيل الإجازة بنجاح', 'success');
    onSave?.();
  };

  const saveData = (key, data) => {
    storeSet(key, data);
  };

  const handleAddLeaveType = () => {
    if (!newLeaveType.name.trim()) {
      addToast('يرجى إدخال اسم النوع', 'error');
      return;
    }
    const updatedTypes = [...leaveTypes, { id: Date.now(), ...newLeaveType }];
    storeSet('leaveTypes', updatedTypes);
    setLeaveTypes(updatedTypes);
    setFormData({ ...formData, leaveTypeId: updatedTypes[updatedTypes.length - 1].id });
    setShowAddType(false);
    setNewLeaveType({ name: '', deductsFromBalance: true });
    addToast('تم إضافة نوع الإجازة بنجاح', 'success');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '700' }}>تسجيل إجازة جديدة</h2>
      
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
            placeholder="مثال: إجازة سنوية"
          />
          {errors.title && <p style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '4px' }}>{errors.title}</p>}
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>نوع الإجازة</label>
          <select
            value={formData.leaveTypeId}
            onChange={(e) => setFormData({ ...formData, leaveTypeId: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              border: errors.leaveTypeId ? '2px solid var(--danger)' : '2px solid var(--border)',
              fontSize: '14px',
              fontFamily: 'Tajawal, sans-serif',
              backgroundColor: 'white'
            }}
          >
            <option value="">اختر نوع الإجازة</option>
            {leaveTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name} {type.deductsFromBalance ? '(يخصم من الرصيد)' : '(لا يخصم)'}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setShowAddType(true)}
            style={{
              marginTop: '8px',
              padding: '8px 16px',
              background: 'transparent',
              border: '1px dashed var(--primary)',
              color: 'var(--primary)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            + إضافة نوع جديد
          </button>
          {errors.leaveTypeId && <p style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '4px' }}>{errors.leaveTypeId}</p>}
        </div>

        {showAddType && (
          <div style={{
            padding: '16px',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '16px'
          }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px' }}>إضافة نوع إجازة جديد</h4>
            <input
              type="text"
              value={newLeaveType.name}
              onChange={(e) => setNewLeaveType({ ...newLeaveType, name: e.target.value })}
              placeholder="اسم النوع"
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '8px',
                borderRadius: 'var(--radius-md)',
                border: '2px solid var(--border)',
                fontSize: '14px'
              }}
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <input
                type="checkbox"
                checked={newLeaveType.deductsFromBalance}
                onChange={(e) => setNewLeaveType({ ...newLeaveType, deductsFromBalance: e.target.checked })}
              />
              <span style={{ fontSize: '13px' }}>يخصم من رصيد الإجازات</span>
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={handleAddLeaveType}
                style={{
                  flex: 1,
                  padding: '8px',
                  background: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer'
                }}
              >
                حفظ
              </button>
              <button
                type="button"
                onClick={() => setShowAddType(false)}
                style={{
                  flex: 1,
                  padding: '8px',
                  background: 'var(--bg-hover)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer'
                }}
              >
                إلغاء
              </button>
            </div>
          </div>
        )}

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>من تاريخ</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              border: errors.startDate ? '2px solid var(--danger)' : '2px solid var(--border)',
              fontSize: '14px',
              fontFamily: 'Tajawal, sans-serif'
            }}
          />
          {errors.startDate && <p style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '4px' }}>{errors.startDate}</p>}
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>إلى تاريخ</label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              border: errors.endDate ? '2px solid var(--danger)' : '2px solid var(--border)',
              fontSize: '14px',
              fontFamily: 'Tajawal, sans-serif'
            }}
          />
          {errors.endDate && <p style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '4px' }}>{errors.endDate}</p>}
        </div>

        {(errors.dateRange || errors.weekend) && (
          <div style={{
            padding: '12px',
            background: '#fef2f2',
            borderRight: '4px solid var(--danger)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '16px'
          }}>
            {errors.dateRange && <p style={{ color: 'var(--danger)', fontSize: '13px', margin: '0 0 8px 0' }}>{errors.dateRange}</p>}
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
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            حفظ الإجازة
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

export default LeaveFormPage;
