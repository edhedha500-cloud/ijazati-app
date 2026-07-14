import React, { useState } from 'react';

const CalculatorPage = ({ settings }) => {
  const [inputMode, setInputMode] = useState('hours');
  const [value, setValue] = useState('');

  const salary = parseFloat(settings.salary) || 0;
  const dailyHours = parseFloat(settings.dailyHours) || 8;
  
  const dailyRate = salary / 30;
  const hourlyRate = dailyRate / dailyHours;
  const minuteRate = hourlyRate / 60;

  const calculateDeduction = () => {
    const numValue = parseFloat(value) || 0;
    
    switch (inputMode) {
      case 'minutes':
        return {
          minutes: numValue,
          hours: numValue / 60,
          days: numValue / 60 / dailyHours,
          amount: numValue * minuteRate
        };
      case 'hours':
        return {
          minutes: numValue * 60,
          hours: numValue,
          days: numValue / dailyHours,
          amount: numValue * hourlyRate
        };
      case 'days':
        return {
          minutes: numValue * dailyHours * 60,
          hours: numValue * dailyHours,
          days: numValue,
          amount: numValue * dailyRate
        };
      default:
        return { minutes: 0, hours: 0, days: 0, amount: 0 };
    }
  };

  const result = calculateDeduction();

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '700' }}>حاسبة الخصومات</h2>

      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-md)',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <label style={{ display: 'block', marginBottom: '12px', fontWeight: '500' }}>نوع الإدخال</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { id: 'minutes', label: 'دقائق' },
            { id: 'hours', label: 'ساعات' },
            { id: 'days', label: 'أيام' }
          ].map(mode => (
            <button
              key={mode.id}
              onClick={() => {
                setInputMode(mode.id);
                setValue('');
              }}
              style={{
                flex: 1,
                padding: '12px',
                background: inputMode === mode.id ? 'var(--primary)' : 'var(--bg-hover)',
                color: inputMode === mode.id ? 'white' : 'var(--text-primary)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: inputMode === mode.id ? '600' : '500'
              }}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-md)',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
          أدخل القيمة ({inputMode === 'minutes' ? 'دقائق' : inputMode === 'hours' ? 'ساعات' : 'أيام'})
        </label>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          min="0"
          step="0.1"
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            border: '2px solid var(--border)',
            fontSize: '16px',
            fontFamily: 'Tajawal, sans-serif'
          }}
          placeholder={`أدخل عدد ${inputMode === 'minutes' ? 'الدقائق' : inputMode === 'hours' ? 'الساعات' : 'الأيام'}`}
        />
      </div>

      {value && (
        <>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            marginBottom: '20px',
            color: 'white'
          }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>إجمالي المبلغ المخصوم</div>
            <div style={{ fontSize: '36px', fontWeight: '700' }}>{result.amount.toFixed(2)}</div>
            <div style={{ fontSize: '14px', opacity: 0.8, marginTop: '4px' }}>{settings.currency}</div>
          </div>

          <div style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>التفاصيل</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <div style={{ padding: '16px', background: 'var(--bg-hover)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>الدقائق</div>
                <div style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)' }}>
                  {result.minutes.toFixed(1)}
                </div>
              </div>

              <div style={{ padding: '16px', background: 'var(--bg-hover)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>الساعات</div>
                <div style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)' }}>
                  {result.hours.toFixed(2)}
                </div>
              </div>

              <div style={{ padding: '16px', background: 'var(--bg-hover)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>الأيام</div>
                <div style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)' }}>
                  {result.days.toFixed(2)}
                </div>
              </div>

              <div style={{ padding: '16px', background: 'var(--bg-hover)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>معدل الخصم اليومي</div>
                <div style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)' }}>
                  {dailyRate.toFixed(2)} {settings.currency}
                </div>
              </div>
            </div>
          </div>

          <div style={{
            background: '#eff6ff',
            borderRight: '4px solid var(--info)',
            borderRadius: 'var(--radius-md)',
            padding: '16px'
          }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: 'var(--info)' }}>
              معادلات الحساب
            </h4>
            <div style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.8' }}>
              <div>• أجر اليوم = الراتب ÷ 30 = {dailyRate.toFixed(2)} {settings.currency}</div>
              <div>• أجر الساعة = الراتب ÷ 30 ÷ ساعات العمل = {hourlyRate.toFixed(2)} {settings.currency}</div>
              <div>• أجر الدقيقة = الراتب ÷ 30 ÷ ساعات العمل ÷ 60 = {minuteRate.toFixed(3)} {settings.currency}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CalculatorPage;
