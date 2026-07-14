import React, { useState, useEffect } from 'react';
import { storeGet, storeSet, calculateCarryOver, defaultLeaveTypes } from '../utils/helpers';
import { Card, Button, ToastContainer, Badge } from '../components/Common';

const BalancePage = () => {
  const [balanceData, setBalanceData] = useState({
    carriedFromLastYear: 0,
    carryOverPolicy: 'max30',
    calculationMethod: 'current',
    monthlyBalances: Array(12).fill().map((_, i) => ({
      month: i + 1,
      accrued: 2.5,
      consumed: 0,
      carried: 0,
      isEdited: false
    }))
  });
  
  const [settings, setSettings] = useState(null);
  const [showToastContainer, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const savedBalance = storeGet('balanceData');
    const savedSettings = storeGet('settings');
    
    if (savedBalance) {
      setBalanceData(savedBalance);
    }
    if (savedSettings) {
      setSettings(savedSettings);
    }
  }, []);

  const handleBalanceChange = (monthIndex, field, value) => {
    setBalanceData(prev => {
      const newBalances = [...prev.monthlyBalances];
      newBalances[monthIndex] = {
        ...newBalances[monthIndex],
        [field]: parseFloat(value) || 0,
        isEdited: true
      };
      
      // إعادة حساب الرصيد المرحل تلقائياً
      let remainingBalance = 0;
      for (let i = 0; i <= monthIndex; i++) {
        const month = newBalances[i];
        remainingBalance += month.accrued - month.consumed;
        
        if (i < 11) {
          newBalances[i].carried = Math.max(0, remainingBalance);
        }
      }
      
      return { ...prev, monthlyBalances: newBalances };
    });
  };

  const handleSave = () => {
    storeSet('balanceData', balanceData);
    setToastMessage('تم حفظ رصيد الإجازات بنجاح');
    setShowToast(true);
  };

  const calculateTotals = () => {
    const totals = balanceData.monthlyBalances.reduce((acc, month) => {
      acc.accrued += month.accrued;
      acc.consumed += month.consumed;
      return acc;
    }, { accrued: 0, consumed: 0 });

    const netBalance = totals.accrued - totals.consumed;
    const carriedToNextYear = calculateCarryOver(
      netBalance,
      balanceData.carryOverPolicy
    );

    return {
      totalAccrued: totals.accrued,
      totalConsumed: totals.consumed,
      netBalance,
      carriedToNextYear
    };
  };

  const totals = calculateTotals();
  const monthNames = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>رصيد الإجازات</h1>
        <p>متابعة رصيد الإجازات الشهري والسنوي</p>
      </div>

      {/* ملخص الرصيد */}
      <Card className="summary-card">
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">الرصيد المرحل</span>
            <span className="summary-value highlight">{balanceData.carriedFromLastYear}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">المستحق الكلي</span>
            <span className="summary-value primary">{totals.totalAccrued.toFixed(1)}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">المستهلك</span>
            <span className="summary-value danger">{totals.totalConsumed.toFixed(1)}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">صافي الرصيد</span>
            <span className="summary-value success">{totals.netBalance.toFixed(1)}</span>
          </div>
          <div className="summary-item full-width">
            <span className="summary-label">المرحل للسنة القادمة</span>
            <span className="summary-value accent">{totals.carriedToNextYear.toFixed(1)}</span>
          </div>
        </div>
      </Card>

      {/* جدول الرصيد الشهري */}
      <Card className="table-card">
        <h2 className="card-title">الرصيد الشهري التفصيلي</h2>
        
        <div className="balance-table">
          <div className="table-header">
            <div className="col-month">الشهر</div>
            <div className="col-accrued">المستحق</div>
            <div className="col-consumed">المستهلك</div>
            <div className="col-carried">المرحل</div>
          </div>
          
          {balanceData.monthlyBalances.map((month, index) => (
            <div key={index} className="table-row">
              <div className="col-month">{monthNames[index]}</div>
              <div className="col-accrued">
                <input
                  type="number"
                  value={month.accrued}
                  onChange={(e) => handleBalanceChange(index, 'accrued', e.target.value)}
                  step="0.5"
                  min="0"
                  className="balance-input"
                />
              </div>
              <div className="col-consumed">
                <input
                  type="number"
                  value={month.consumed}
                  onChange={(e) => handleBalanceChange(index, 'consumed', e.target.value)}
                  step="0.5"
                  min="0"
                  className="balance-input"
                />
              </div>
              <div className="col-carried">
                <Badge variant={month.carried > 0 ? 'success' : 'secondary'}>
                  {month.carried.toFixed(1)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* إعدادات الترحيل */}
      <Card className="settings-card">
        <h2 className="card-title">سياسة الترحيل</h2>
        
        <div className="setting-row">
          <label className="setting-label">نظام ترحيل الرصيد</label>
          <select
            value={balanceData.carryOverPolicy}
            onChange={(e) => setBalanceData(prev => ({ ...prev, carryOverPolicy: e.target.value }))}
            className="select-input"
          >
            <option value="full">ترحيل كامل الرصيد</option>
            <option value="max30">حد أقصى 30 يوم</option>
            <option value="max15">حد أقصى 15 يوم</option>
            <option value="none">لا يوجد ترحيل</option>
          </select>
        </div>

        <div className="setting-row">
          <label className="setting-label">طريقة حساب الرصيد المستحق</label>
          <select
            value={balanceData.calculationMethod}
            onChange={(e) => setBalanceData(prev => ({ ...prev, calculationMethod: e.target.value }))}
            className="select-input"
          >
            <option value="current">حتى الشهر الحالي</option>
            <option value="full">للأشهر الـ12 كاملة</option>
          </select>
        </div>
      </Card>

      <Button onClick={handleSave} variant="primary" className="save-button">
        حفظ التغييرات
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

        .summary-card {
          margin-bottom: 16px;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .summary-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .summary-item.full-width {
          grid-column: span 2;
          margin-top: 8px;
          padding-top: 12px;
          border-top: 2px solid #F3F4F6;
        }

        .summary-label {
          font-size: 12px;
          color: #6B7280;
        }

        .summary-value {
          font-size: 20px;
          font-weight: bold;
        }

        .summary-value.highlight { color: #F59E0B; }
        .summary-value.primary { color: #7C3AED; }
        .summary-value.danger { color: #EF4444; }
        .summary-value.success { color: #10B981; }
        .summary-value.accent { color: #F97316; }

        .table-card {
          margin-bottom: 16px;
        }

        .card-title {
          font-size: 18px;
          color: #1F2937;
          margin: 0 0 16px 0;
        }

        .balance-table {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .table-header {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 8px;
          padding: 12px;
          background: #F9FAFB;
          border-radius: 8px;
          font-weight: bold;
          font-size: 13px;
          color: #4B5563;
        }

        .table-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 8px;
          padding: 12px;
          background: white;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          align-items: center;
        }

        .col-month {
          font-size: 14px;
          color: #1F2937;
        }

        .balance-input {
          width: 100%;
          padding: 8px;
          border: 2px solid #E5E7EB;
          border-radius: 6px;
          text-align: center;
          font-size: 14px;
        }

        .balance-input:focus {
          outline: none;
          border-color: #7C3AED;
        }

        .settings-card {
          margin-bottom: 16px;
        }

        .setting-row {
          margin-bottom: 16px;
        }

        .setting-row:last-child {
          margin-bottom: 0;
        }

        .setting-label {
          display: block;
          font-size: 14px;
          color: #4B5563;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .select-input {
          width: 100%;
          padding: 12px;
          border: 2px solid #E5E7EB;
          border-radius: 12px;
          font-size: 16px;
        }

        .save-button {
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default BalancePage;
