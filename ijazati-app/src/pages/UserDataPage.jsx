import React, { useState, useEffect } from 'react';
import { storeGet, storeSet } from '../utils/helpers';
import { Field, Button, Card, Toast } from '../components/Common';

const UserDataPage = ({ onNavigate }) => {
  const [userData, setUserData] = useState({
    fullName: '',
    phoneNumber: '',
    country: ''
  });
  const [isSaved, setIsSaved] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const savedData = storeGet('userData');
    if (savedData) {
      setUserData(savedData);
      setIsSaved(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleSave = () => {
    if (!userData.fullName || !userData.phoneNumber) {
      setToastMessage('يرجى ملء جميع الحقول المطلوبة');
      setShowToast(true);
      return;
    }

    storeSet('userData', userData);
    setIsSaved(true);
    setToastMessage('تم حفظ البيانات بنجاح');
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
      if (onNavigate) {
        onNavigate('settings');
      }
    }, 1500);
  };

  const isFormValid = userData.fullName && userData.phoneNumber;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>بياناتي</h1>
        <p>أدخل معلوماتك الشخصية</p>
      </div>

      <Card className="welcome-card">
        <div className="welcome-content">
          <h2>مرحباً بك في تطبيق إجازتي</h2>
          <p>ابدأ بإدخال بياناتك الشخصية للمتابعة</p>
        </div>
      </Card>

      <div className="form-section">
        <Field label="الاسم الكامل" required>
          <input
            type="text"
            name="fullName"
            value={userData.fullName}
            onChange={handleChange}
            placeholder="أدخل اسمك الكامل"
            className="text-input"
          />
        </Field>

        <Field label="رقم الهاتف" required>
          <input
            type="tel"
            name="phoneNumber"
            value={userData.phoneNumber}
            onChange={handleChange}
            placeholder="أدخل رقم هاتفك"
            className="text-input"
          />
        </Field>

        <Field label="الدولة">
          <select
            name="country"
            value={userData.country}
            onChange={handleChange}
            className="select-input"
          >
            <option value="">اختر الدولة</option>
            <option value="SA">السعودية</option>
            <option value="AE">الإمارات</option>
            <option value="KW">الكويت</option>
            <option value="QA">قطر</option>
            <option value="BH">البحرين</option>
            <option value="OM">عمان</option>
            <option value="EG">مصر</option>
            <option value="JO">الأردن</option>
            <option value="LB">لبنان</option>
            <option value="IQ">العراق</option>
          </select>
        </Field>

        <Button 
          onClick={handleSave} 
          disabled={!isFormValid || isSaved}
          variant={isSaved ? 'success' : 'primary'}
          className="save-button"
        >
          {isSaved ? '✓ تم الحفظ' : 'حفظ البيانات'}
        </Button>
      </div>

      {showToast && (
        <Toast message={toastMessage} type="success" onClose={() => setShowToast(false)} />
      )}

      <style jsx>{`
        .page-container {
          padding: 16px;
          max-width: 480px;
          margin: 0 auto;
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

        .welcome-card {
          background: linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%);
          color: white;
          margin-bottom: 24px;
        }

        .welcome-content h2 {
          font-size: 20px;
          margin: 0 0 8px 0;
        }

        .welcome-content p {
          opacity: 0.9;
          margin: 0;
          font-size: 14px;
        }

        .form-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .save-button {
          margin-top: 8px;
        }

        .text-input, .select-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #E5E7EB;
          border-radius: 12px;
          font-size: 16px;
          transition: all 0.2s;
          font-family: inherit;
        }

        .text-input:focus, .select-input:focus {
          outline: none;
          border-color: #7C3AED;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
        }
      `}</style>
    </div>
  );
};

export default UserDataPage;
