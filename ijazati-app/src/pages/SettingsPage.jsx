import React, { useState, useEffect } from 'react';
import { storeGet, storeSet } from '../utils/helpers';
import { Field, Button, Card, Toast, Row } from '../components/Common';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
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
  
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const savedSettings = storeGet('settings');
    if (savedSettings) {
      setSettings(prev => ({ ...prev, ...savedSettings }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleWeekendChange = (day) => {
    setSettings(prev => {
      const weekendDays = prev.weekendDays.includes(day)
        ? prev.weekendDays.filter(d => d !== day)
        : [...prev.weekendDays, day];
      return { ...prev, weekendDays };
    });
  };

  const handleSave = () => {
    if (!settings.salary || parseFloat(settings.salary) <= 0) {
      setToastMessage('يرجى إدخال الراتب بشكل صحيح');
      setShowToast(true);
      return;
    }

    storeSet('settings', settings);
    setToastMessage('تم حفظ الإعدادات بنجاح');
    setShowToast(true);
  };

  const weekendDayNames = {
    0: 'الأحد',
    1: 'الاثنين',
    2: 'الثلاثاء',
    3: 'الأربعاء',
    4: 'الخميس',
    5: 'الجمعة',
    6: 'السبت'
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>الإعدادات</h1>
        <p>إعدادات الراتب والدوام والإجازات</p>
      </div>

      {/* الراتب والدوام */}
      <Card className="settings-card">
        <h2 className="card-title">الراتب والدوام</h2>
        
        <Row gap="12px">
          <div className="field-half">
            <label className="field-label">الراتب الشهري</label>
            <input
              type="number"
              name="salary"
              value={settings.salary}
              onChange={handleChange}
              placeholder="0.00"
              className="text-input"
            />
          </div>
          
          <div className="field-half">
            <label className="field-label">العملة</label>
            <select
              name="currency"
              value={settings.currency}
              onChange={handleChange}
              className="text-input"
            >
              <option value="SAR">ريال سعودي</option>
              <option value="AED">درهم إماراتي</option>
              <option value="KWD">دينار كويتي</option>
              <option value="QAR">ريال قطري</option>
              <option value="BHD">دينار بحريني</option>
              <option value="OMR">ريال عماني</option>
              <option value="EGP">جنيه مصري</option>
              <option value="JOD">دينار أردني</option>
            </select>
          </div>
        </Row>

        <Field label="ساعات الدوام اليومية">
          <input
            type="number"
            name="dailyHours"
            value={settings.dailyHours}
            onChange={handleChange}
            className="text-input"
            min="1"
            max="24"
          />
        </Field>

        <Field label="نوع الدوام">
          <select
            name="workType"
            value={settings.workType}
            onChange={handleChange}
            className="text-input"
          >
            <option value="single">فترة واحدة</option>
            <option value="double">فترتين</option>
          </select>
        </Field>

        {settings.workType === 'single' ? (
          <Row gap="12px">
            <div className="field-half">
              <label className="field-label">وقت البدء</label>
              <input
                type="time"
                name="morningStart"
                value={settings.morningStart}
                onChange={handleChange}
                className="text-input"
              />
            </div>
            <div className="field-half">
              <label className="field-label">وقت الانتهاء</label>
              <input
                type="time"
                name="morningEnd"
                value={settings.morningEnd}
                onChange={handleChange}
                className="text-input"
              />
            </div>
          </Row>
        ) : (
          <>
            <div className="period-section">
              <h3 className="period-title">الفترة الصباحية</h3>
              <Row gap="12px">
                <div className="field-half">
                  <label className="field-label">وقت البدء</label>
                  <input
                    type="time"
                    name="morningStart"
                    value={settings.morningStart}
                    onChange={handleChange}
                    className="text-input"
                  />
                </div>
                <div className="field-half">
                  <label className="field-label">وقت الانتهاء</label>
                  <input
                    type="time"
                    name="morningEnd"
                    value={settings.morningEnd}
                    onChange={handleChange}
                    className="text-input"
                  />
                </div>
              </Row>
            </div>
            
            <div className="period-section">
              <h3 className="period-title">الفترة المسائية</h3>
              <Row gap="12px">
                <div className="field-half">
                  <label className="field-label">وقت البدء</label>
                  <input
                    type="time"
                    name="afternoonStart"
                    value={settings.afternoonStart}
                    onChange={handleChange}
                    className="text-input"
                  />
                </div>
                <div className="field-half">
                  <label className="field-label">وقت الانتهاء</label>
                  <input
                    type="time"
                    name="afternoonEnd"
                    value={settings.afternoonEnd}
                    onChange={handleChange}
                    className="text-input"
                  />
                </div>
              </Row>
            </div>
          </>
        )}
      </Card>

      {/* دورة الشهر */}
      <Card className="settings-card">
        <h2 className="card-title">دورة الشهر</h2>
        
        <Row gap="12px">
          <div className="field-half">
            <label className="field-label">بداية الشهر (يوم)</label>
            <input
              type="number"
              name="monthStart"
              value={settings.monthStart}
              onChange={handleChange}
              className="text-input"
              min="1"
              max="31"
            />
          </div>
          <div className="field-half">
            <label className="field-label">نهاية الشهر (يوم)</label>
            <input
              type="number"
              name="monthEnd"
              value={settings.monthEnd}
              onChange={handleChange}
              className="text-input"
              min="1"
              max="31"
            />
          </div>
        </Row>
      </Card>

      {/* الإجازات الأسبوعية */}
      <Card className="settings-card">
        <h2 className="card-title">الإجازات الأسبوعية</h2>
        
        <div className="weekend-selector">
          {Object.entries(weekendDayNames).map(([day, name]) => (
            <label key={day} className="weekend-option">
              <input
                type="checkbox"
                checked={settings.weekendDays.includes(parseInt(day))}
                onChange={() => handleWeekendChange(parseInt(day))}
              />
              <span>{name}</span>
            </label>
          ))}
        </div>

        <Field label="أيام الإجازة التعويضية سنوياً">
          <input
            type="number"
            name="compensatoryDays"
            value={settings.compensatoryDays}
            onChange={handleChange}
            className="text-input"
            min="0"
          />
        </Field>
      </Card>

      {/* رصيد الإجازات */}
      <Card className="settings-card">
        <h2 className="card-title">رصيد الإجازات</h2>
        
        <Field label="الرصيد الشهري المستحق (أيام)">
          <input
            type="number"
            name="monthlyLeave"
            value={settings.monthlyLeave}
            onChange={handleChange}
            className="text-input"
            step="0.5"
            min="0"
          />
        </Field>

        <Field label="سياسة ترحيل الرصيد">
          <select
            name="carryOverPolicy"
            value={settings.carryOverPolicy}
            onChange={handleChange}
            className="text-input"
          >
            <option value="full">ترحيل كامل الرصيد</option>
            <option value="max30">حد أقصى 30 يوم</option>
            <option value="max15">حد أقصى 15 يوم</option>
            <option value="none">لا يوجد ترحيل</option>
          </select>
        </Field>

        <Field label="طريقة حساب الرصيد المستحق">
          <select
            name="calculationMethod"
            value={settings.calculationMethod}
            onChange={handleChange}
            className="text-input"
          >
            <option value="current">حتى الشهر الحالي</option>
            <option value="full">للأشهر الـ12 كاملة</option>
          </select>
        </Field>
      </Card>

      <Button onClick={handleSave} variant="primary" className="save-button">
        حفظ الإعدادات
      </Button>

      {showToast && (
        <Toast message={toastMessage} type="success" onClose={() => setShowToast(false)} />
      )}

      <style jsx>{`
        .page-container {
          padding: 16px;
          max-width: 480px;
          margin: 0 auto;
          padding-bottom: 80px;
        }

        .page-header {
          margin-bottom: 24px;
        }

        .page-header h1 {
          font-size: 24px;
          color: #1F2937;
          margin: 0 0 8px 0;
        }

        .page-header p {
          color: #6B7280;
          margin: 0;
          font-size: 14px;
        }

        .settings-card {
          margin-bottom: 16px;
        }

        .card-title {
          font-size: 18px;
          color: #1F2937;
          margin: 0 0 16px 0;
          padding-bottom: 12px;
          border-bottom: 2px solid #F3F4F6;
        }

        .field-half {
          flex: 1;
        }

        .field-label {
          display: block;
          font-size: 14px;
          color: #4B5563;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .text-input {
          width: 100%;
          padding: 12px;
          border: 2px solid #E5E7EB;
          border-radius: 12px;
          font-size: 16px;
          transition: all 0.2s;
          box-sizing: border-box;
        }

        .text-input:focus {
          outline: none;
          border-color: #7C3AED;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
        }

        .period-section {
          background: #F9FAFB;
          padding: 16px;
          border-radius: 12px;
          margin-top: 12px;
        }

        .period-title {
          font-size: 14px;
          color: #6B7280;
          margin: 0 0 12px 0;
        }

        .weekend-selector {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 16px;
        }

        .weekend-option {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background: #F9FAFB;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .weekend-option:hover {
          background: #F3F4F6;
        }

        .weekend-option input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: #7C3AED;
        }

        .weekend-option span {
          font-size: 14px;
          color: #4B5563;
        }

        .save-button {
          width: 100%;
          margin-top: 16px;
        }
      `}</style>
    </div>
  );
};

export default SettingsPage;
