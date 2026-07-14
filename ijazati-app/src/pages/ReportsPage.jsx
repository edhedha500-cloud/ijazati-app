import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { calculateEarlyLeaveHours, calculateLateArrivalHours, getDaysInMonth } from '../utils/helpers';

const ReportsPage = ({ userData, settings, leaves, earlyLeaves, lateArrivals, leaveTypes }) => {
  const [dateRange, setDateRange] = useState('month');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const getDateRange = () => {
    const now = new Date();
    let start, end;

    switch (dateRange) {
      case 'week':
        const dayOfWeek = now.getDay();
        start = new Date(now);
        start.setDate(now.getDate() - dayOfWeek);
        start.setHours(0, 0, 0, 0);
        end = new Date(now);
        end.setDate(now.getDate() + (6 - dayOfWeek));
        end.setHours(23, 59, 59, 999);
        break;
      case 'year':
        start = new Date(currentYear, 0, 1);
        end = new Date(currentYear, 11, 31, 23, 59, 59, 999);
        break;
      case 'custom':
        start = customStart ? new Date(customStart) : new Date(currentYear, currentMonth - 1, 1);
        end = customEnd ? new Date(customEnd) : new Date();
        break;
      case 'month':
      default:
        start = new Date(currentYear, currentMonth - 1, 1);
        end = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);
        break;
    }

    return { start, end };
  };

  const filteredData = useMemo(() => {
    const { start, end } = getDateRange();

    const filteredLeaves = leaves.filter(leave => {
      const leaveStart = new Date(leave.startDate);
      return leaveStart >= start && leaveStart <= end;
    });

    const filteredEarly = earlyLeaves.filter(el => {
      const elDate = new Date(el.date);
      return elDate >= start && elDate <= end;
    });

    const filteredLate = lateArrivals.filter(la => {
      const laDate = new Date(la.date);
      return laDate >= start && laDate <= end;
    });

    return { filteredLeaves, filteredEarly, filteredLate };
  }, [leaves, earlyLeaves, lateArrivals, dateRange, customStart, customEnd]);

  const statistics = useMemo(() => {
    const { filteredLeaves, filteredEarly, filteredLate } = filteredData;

    let totalLeaveDays = 0;
    filteredLeaves.forEach(leave => {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      totalLeaveDays += diffDays;
    });

    let totalEarlyHours = 0;
    let totalEarlyCount = filteredEarly.length;
    filteredEarly.forEach(el => {
      const hours = calculateEarlyLeaveHours(el.time, settings);
      totalEarlyHours += hours;
    });

    let totalLateHours = 0;
    let totalLateCount = filteredLate.length;
    filteredLate.forEach(la => {
      const hours = calculateLateArrivalHours(la.time, settings);
      totalLateHours += hours;
    });

    const totalDeductionHours = totalEarlyHours + totalLateHours;
    const totalDeductionDays = totalDeductionHours / (settings.dailyHours || 8);

    const salary = parseFloat(settings.salary) || 0;
    const dailyRate = salary / 30;
    const hourlyRate = dailyRate / (settings.dailyHours || 8);
    const totalDeductionAmount = totalDeductionHours * hourlyRate;

    return {
      totalLeaveDays,
      totalEarlyHours,
      totalEarlyCount,
      totalLateHours,
      totalLateCount,
      totalDeductionHours,
      totalDeductionDays,
      totalDeductionAmount
    };
  }, [filteredData, settings]);

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    const leavesData = filteredData.filteredLeaves.map(leave => ({
      'العنوان': leave.title,
      'النوع': leaveTypes.find(t => t.id === leave.leaveTypeId)?.name || 'غير معروف',
      'من تاريخ': leave.startDate,
      'إلى تاريخ': leave.endDate,
      'ملاحظات': leave.notes || ''
    }));

    const earlyData = filteredData.filteredEarly.map(el => ({
      'العنوان': el.title,
      'التاريخ': el.date,
      'الوقت': el.time,
      'ملاحظات': el.notes || ''
    }));

    const lateData = filteredData.filteredLate.map(la => ({
      'العنوان': la.title,
      'التاريخ': la.date,
      'الوقت': la.time,
      'ملاحظات': la.notes || ''
    }));

    const summaryData = [{
      'إجمالي أيام الإجازات': statistics.totalLeaveDays,
      'إجمالي ساعات الانصراف': statistics.totalEarlyHours.toFixed(2),
      'عدد مرات الانصراف': statistics.totalEarlyCount,
      'إجمالي ساعات التأخير': statistics.totalLateHours.toFixed(2),
      'عدد مرات التأخير': statistics.totalLateCount,
      'إجمالي ساعات الخصم': statistics.totalDeductionHours.toFixed(2),
      'إجمالي أيام الخصم': statistics.totalDeductionDays.toFixed(2),
      'إجمالي المبلغ المخصوم': `${statistics.totalDeductionAmount.toFixed(2)} ${settings.currency}`
    }];

    const wsLeaves = XLSX.utils.json_to_sheet(leavesData);
    const wsEarly = XLSX.utils.json_to_sheet(earlyData);
    const wsLate = XLSX.utils.json_to_sheet(lateData);
    const wsSummary = XLSX.utils.json_to_sheet(summaryData);

    XLSX.utils.book_append_sheet(wb, wsLeaves, 'الإجازات');
    XLSX.utils.book_append_sheet(wb, wsEarly, 'إذن الانصراف');
    XLSX.utils.book_append_sheet(wb, wsLate, 'إذن التأخير');
    XLSX.utils.book_append_sheet(wb, wsSummary, 'الملخص');

    XLSX.writeFile(wb, `تقرير_إجازتي_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF({ direction: 'rtl' });
    
    doc.setFont('tajawal', 'normal');
    doc.setFontSize(18);
    doc.text('تقرير إجازتي', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`المستخدم: ${userData?.fullName || 'غير محدد'}`, 20, 35);
    doc.text(`تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}`, 20, 42);

    const summaryData = [
      ['إجمالي أيام الإجازات', statistics.totalLeaveDays.toString()],
      ['إجمالي ساعات الانصراف', statistics.totalEarlyHours.toFixed(2)],
      ['عدد مرات الانصراف', statistics.totalEarlyCount.toString()],
      ['إجمالي ساعات التأخير', statistics.totalLateHours.toFixed(2)],
      ['عدد مرات التأخير', statistics.totalLateCount.toString()],
      ['إجمالي المبلغ المخصوم', `${statistics.totalDeductionAmount.toFixed(2)} ${settings.currency}`]
    ];

    doc.autoTable({
      startY: 50,
      head: [['البيان', 'القيمة']],
      body: summaryData,
      theme: 'striped',
      headStyles: { fillColor: [99, 102, 241] },
      styles: { font: 'tajawal', fontSize: 10 },
      margin: { top: 50 }
    });

    doc.save(`تقرير_إجازتي_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '700' }}>التقارير والإحصائيات</h2>

      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-md)',
        padding: '16px',
        marginBottom: '20px'
      }}>
        <label style={{ display: 'block', marginBottom: '12px', fontWeight: '500' }}>النطاق الزمني</label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'week', label: 'الأسبوع' },
            { id: 'month', label: 'الشهر' },
            { id: 'year', label: 'السنة' },
            { id: 'custom', label: 'مخصص' }
          ].map(range => (
            <button
              key={range.id}
              onClick={() => setDateRange(range.id)}
              style={{
                padding: '10px 20px',
                background: dateRange === range.id ? 'var(--primary)' : 'var(--bg-hover)',
                color: dateRange === range.id ? 'white' : 'var(--text-primary)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: dateRange === range.id ? '600' : '500'
              }}
            >
              {range.label}
            </button>
          ))}
        </div>

        {dateRange === 'custom' && (
          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                border: '2px solid var(--border)',
                fontSize: '14px'
              }}
              placeholder="من تاريخ"
            />
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                border: '2px solid var(--border)',
                fontSize: '14px'
              }}
              placeholder="إلى تاريخ"
            />
          </div>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '20px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          color: 'white'
        }}>
          <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '8px' }}>إجمالي الإجازات المستهلكة</div>
          <div style={{ fontSize: '28px', fontWeight: '700' }}>{statistics.totalLeaveDays}</div>
          <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>يوم</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          color: 'white'
        }}>
          <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '8px' }}>إذن الانصراف</div>
          <div style={{ fontSize: '28px', fontWeight: '700' }}>{statistics.totalEarlyHours.toFixed(1)}</div>
          <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>ساعة ({statistics.totalEarlyCount} مرة)</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          color: 'white'
        }}>
          <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '8px' }}>إذن التأخير</div>
          <div style={{ fontSize: '28px', fontWeight: '700' }}>{statistics.totalLateHours.toFixed(1)}</div>
          <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>ساعة ({statistics.totalLateCount} مرة)</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          color: 'white'
        }}>
          <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '8px' }}>الخصم من الراتب</div>
          <div style={{ fontSize: '28px', fontWeight: '700' }}>{statistics.totalDeductionAmount.toFixed(2)}</div>
          <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>{settings.currency}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={exportToExcel}
          style={{
            flex: 1,
            padding: '14px',
            background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          📊 تصدير Excel
        </button>
        <button
          onClick={exportToPDF}
          style={{
            flex: 1,
            padding: '14px',
            background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          📄 تصدير PDF
        </button>
      </div>
    </div>
  );
};

export default ReportsPage;
