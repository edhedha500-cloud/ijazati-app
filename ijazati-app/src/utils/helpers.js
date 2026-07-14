import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, setMonth, setYear, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';

// ============================================
// دوال التخزين المحلي
// ============================================

export const storeGet = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

export const storeSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
    return false;
  }
};

// ============================================
// دوال التاريخ والوقت
// ============================================

export const formatDate = (date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : new Date(date);
  return format(d, 'yyyy-MM-dd');
};

export const formatTime = (date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : new Date(date);
  return format(d, 'HH:mm');
};

export const formatDateTime = (date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : new Date(date);
  return format(d, 'yyyy-MM-dd HH:mm');
};

export const getDaysInMonth = (year, month) => {
  const start = startOfMonth(new Date(year, month - 1));
  const end = endOfMonth(new Date(year, month - 1));
  return eachDayOfInterval({ start, end });
};

export const getMonthName = (month, locale = 'ar-SA') => {
  const date = new Date(2024, month - 1, 1);
  return format(date, 'MMMM', { locale });
};

export const getWeekdayName = (date, locale = 'ar-SA') => {
  const d = typeof date === 'string' ? parseISO(date) : new Date(date);
  return format(d, 'EEEE', { locale });
};

export const isWeekend = (date, weekendDays = [5, 6]) => {
  const d = typeof date === 'string' ? parseISO(date) : new Date(date);
  return weekendDays.includes(d.getDay());
};

export const isWeekendDay = (dayIndex, weekendDays = [5, 6]) => {
  return weekendDays.includes(dayIndex);
};

export const hasLeaveOnDate = (date, leaves) => {
  if (!date || !leaves || leaves.length === 0) return false;
  const checkDate = new Date(date);
  return leaves.some(leave => {
    const start = new Date(leave.startDate);
    const end = new Date(leave.endDate);
    return checkDate >= start && checkDate <= end;
  });
};

export const validateLeaveOverlap = (startDate, endDate, leaves, excludeId = null) => {
  if (!startDate || !endDate || !leaves) return false;
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return leaves.some(leave => {
    if (excludeId && leave.id === excludeId) return false;
    const leaveStart = new Date(leave.startDate);
    const leaveEnd = new Date(leave.endDate);
    
    return (start <= leaveEnd && end >= leaveStart);
  });
};

export const calculateEarlyLeaveHours = (time, settings) => {
  if (!time || !settings) return 0;
  
  const workType = settings.workType || 'single';
  const timeParts = time.split(':');
  const timeMinutes = parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);
  
  if (workType === 'single') {
    const endParts = (settings.morningEnd || '17:00').split(':');
    const endMinutes = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);
    const diffMinutes = Math.max(0, endMinutes - timeMinutes);
    return diffMinutes / 60;
  } else {
    const morningEndParts = (settings.morningEnd || '12:00').split(':');
    const morningEndMinutes = parseInt(morningEndParts[0]) * 60 + parseInt(morningEndParts[1]);
    const afternoonEndParts = (settings.afternoonEnd || '20:00').split(':');
    const afternoonEndMinutes = parseInt(afternoonEndParts[0]) * 60 + parseInt(afternoonEndParts[1]);
    
    if (timeMinutes <= morningEndMinutes) {
      const diffMinutes = Math.max(0, morningEndMinutes - timeMinutes);
      const afternoonHours = (afternoonEndMinutes - parseInt(settings.afternoonStart?.split(':')[0] || '16') * 60) / 60;
      return diffMinutes / 60 + afternoonHours;
    } else {
      const diffMinutes = Math.max(0, afternoonEndMinutes - timeMinutes);
      return diffMinutes / 60;
    }
  }
};

export const calculateLateArrivalHours = (time, settings) => {
  if (!time || !settings) return 0;
  
  const workType = settings.workType || 'single';
  const timeParts = time.split(':');
  const timeMinutes = parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);
  
  if (workType === 'single') {
    const startParts = (settings.morningStart || '08:00').split(':');
    const startMinutes = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
    const diffMinutes = Math.max(0, timeMinutes - startMinutes);
    return diffMinutes / 60;
  } else {
    const morningStartParts = (settings.morningStart || '08:00').split(':');
    const morningStartMinutes = parseInt(morningStartParts[0]) * 60 + parseInt(morningStartParts[1]);
    const afternoonStartParts = (settings.afternoonStart || '16:00').split(':');
    const afternoonStartMinutes = parseInt(afternoonStartParts[0]) * 60 + parseInt(afternoonStartParts[1]);
    
    if (timeMinutes <= morningStartMinutes) {
      return 0;
    } else if (timeMinutes <= afternoonStartMinutes) {
      const diffMinutes = Math.max(0, timeMinutes - morningStartMinutes);
      return diffMinutes / 60;
    } else {
      const diffMinutes = Math.max(0, timeMinutes - afternoonStartMinutes);
      return diffMinutes / 60;
    }
  }
};

// ============================================
// دوال حساب الإجازات والخصومات
// ============================================

export const calculateDailyRate = (salary) => {
  if (!salary || salary <= 0) return 0;
  return salary / 30;
};

export const calculateHourlyRate = (salary, dailyHours) => {
  if (!salary || salary <= 0 || !dailyHours || dailyHours <= 0) return 0;
  return calculateDailyRate(salary) / dailyHours;
};

export const calculateMinuteRate = (salary, dailyHours) => {
  if (!salary || salary <= 0 || !dailyHours || dailyHours <= 0) return 0;
  return calculateHourlyRate(salary, dailyHours) / 60;
};

export const calculateDeduction = (type, value, salary, dailyHours) => {
  switch (type) {
    case 'minutes':
      return value * calculateMinuteRate(salary, dailyHours);
    case 'hours':
      return value * calculateHourlyRate(salary, dailyHours);
    case 'days':
      return value * calculateDailyRate(salary);
    default:
      return 0;
  }
};

export const calculateLeaveDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const start = typeof startDate === 'string' ? parseISO(startDate) : new Date(startDate);
  const end = typeof endDate === 'string' ? parseISO(endDate) : new Date(endDate);
  const days = differenceInDays(end, start) + 1;
  return Math.max(0, days);
};

export const calculateTimeDifference = (startTime, endTime) => {
  if (!startTime || !endTime) return { hours: 0, minutes: 0 };
  
  const start = typeof startTime === 'string' ? parseISO(`2024-01-01T${startTime}`) : new Date(startTime);
  const end = typeof endTime === 'string' ? parseISO(`2024-01-01T${endTime}`) : new Date(endTime);
  
  const totalMinutes = differenceInMinutes(end, start);
  const hours = Math.floor(Math.abs(totalMinutes) / 60);
  const minutes = Math.abs(totalMinutes) % 60;
  
  return { hours, minutes, totalMinutes: Math.abs(totalMinutes) };
};

// ============================================
// دوال التحقق من التداخل
// ============================================

export const checkLeaveOverlap = (startDate, endDate, leaves, excludeId = null) => {
  const start = typeof startDate === 'string' ? parseISO(startDate) : new Date(startDate);
  const end = typeof endDate === 'string' ? parseISO(endDate) : new Date(endDate);
  
  for (const leave of leaves) {
    if (leave.id === excludeId) continue;
    
    const leaveStart = typeof leave.startDate === 'string' ? parseISO(leave.startDate) : new Date(leave.startDate);
    const leaveEnd = typeof leave.endDate === 'string' ? parseISO(leave.endDate) : new Date(leave.endDate);
    
    // تحقق من التداخل
    if (start <= leaveEnd && end >= leaveStart) {
      return true;
    }
  }
  
  return false;
};

export const checkLeaveOnDate = (date, leaves) => {
  const checkDate = typeof date === 'string' ? parseISO(date) : new Date(date);
  
  for (const leave of leaves) {
    const leaveStart = typeof leave.startDate === 'string' ? parseISO(leave.startDate) : new Date(leave.startDate);
    const leaveEnd = typeof leave.endDate === 'string' ? parseISO(leave.endDate) : new Date(leave.endDate);
    
    if (checkDate >= leaveStart && checkDate <= leaveEnd) {
      return true;
    }
  }
  
  return false;
};

// ============================================
// دوال رصيد الإجازات
// ============================================

export const calculateAccruedLeave = (currentMonth, settings, balanceHistory) => {
  const { monthlyLeave = 2.5, calculationMethod = 'current' } = settings;
  
  if (calculationMethod === 'full') {
    return monthlyLeave * 12;
  }
  
  // حتى الشهر الحالي
  return monthlyLeave * (currentMonth + 1);
};

export const calculateCarryOver = (remainingBalance, policy, maxDays = 0) => {
  switch (policy) {
    case 'full':
      return remainingBalance;
    case 'max30':
      return Math.min(remainingBalance, 30);
    case 'max15':
      return Math.min(remainingBalance, 15);
    case 'none':
      return 0;
    case 'custom':
      return Math.min(remainingBalance, maxDays);
    default:
      return remainingBalance;
  }
};

export const calculateConsumedLeave = (leaves, leaveTypes) => {
  let totalDays = 0;
  
  for (const leave of leaves) {
    const leaveType = leaveTypes.find(t => t.id === leave.typeId);
    if (leaveType && leaveType.deductFromBalance) {
      const duration = calculateLeaveDuration(leave.startDate, leave.endDate);
      totalDays += duration;
    }
  }
  
  return totalDays;
};

export const calculateTimeOffInDays = (timeOffRecords, dailyHours) => {
  if (!dailyHours || dailyHours <= 0) return 0;
  
  let totalHours = 0;
  
  for (const record of timeOffRecords) {
    if (record.hours) {
      totalHours += parseFloat(record.hours) || 0;
    } else if (record.timeValue) {
      const [h, m] = record.timeValue.split(':').map(Number);
      totalHours += h + (m / 60);
    }
  }
  
  return totalHours / dailyHours;
};

// ============================================
// أنواع الإجازات الافتراضية
// ============================================

export const defaultLeaveTypes = [
  { id: 'annual', name: 'إجازة سنوية', deductFromBalance: true, color: '#7C3AED' },
  { id: 'unpaid', name: 'بدون راتب', deductFromBalance: true, color: '#EF4444' },
  { id: 'rest', name: 'راحة بالخصم', deductFromBalance: true, color: '#F59E0B' },
  { id: 'emergency', name: 'إجازة طارئة', deductFromBalance: false, color: '#10B981' },
  { id: 'sick', name: 'إجازة مرضية', deductFromBalance: false, color: '#3B82F6' },
  { id: 'mission', name: 'مهمة عمل', deductFromBalance: false, color: '#8B5CF6' },
  { id: 'official', name: 'عطلة رسمية', deductFromBalance: false, color: '#6B7280' },
  { id: 'marriage', name: 'إجازة زواج', deductFromBalance: false, color: '#EC4899' },
  { id: 'paternity', name: 'إجازة مولود', deductFromBalance: false, color: '#14B8A6' },
  { id: 'bereavement', name: 'إجازة وفاة', deductFromBalance: false, color: '#6366F1' },
];

// ============================================
// دوال التصدير
// ============================================

export const exportToExcel = async (data, filename) => {
  try {
    const XLSX = await import('xlsx');
    const wb = XLSX.utils.book_new();
    
    // ورقة الإجازات
    if (data.leaves && data.leaves.length > 0) {
      const leavesData = data.leaves.map(l => ({
        'المعرف': l.id,
        'العنوان': l.title,
        'النوع': l.typeName,
        'تاريخ البداية': formatDate(l.startDate),
        'تاريخ النهاية': formatDate(l.endDate),
        'المدة (أيام)': calculateLeaveDuration(l.startDate, l.endDate),
        'ملاحظات': l.notes || ''
      }));
      const wsLeaves = XLSX.utils.json_to_sheet(leavesData);
      XLSX.utils.book_append_sheet(wb, wsLeaves, 'الإجازات');
    }
    
    // ورقة إذن الانصراف
    if (data.earlyLeaves && data.earlyLeaves.length > 0) {
      const earlyLeavesData = data.earlyLeaves.map(l => ({
        'المعرف': l.id,
        'العنوان': l.title,
        'التاريخ': formatDate(l.date),
        'الوقت': l.timeValue,
        'المدة (ساعات)': l.hours || 0,
        'ملاحظات': l.notes || ''
      }));
      const wsEarly = XLSX.utils.json_to_sheet(earlyLeavesData);
      XLSX.utils.book_append_sheet(wb, wsEarly, 'إذن الانصراف');
    }
    
    // ورقة إذن التأخير
    if (data.lateArrivals && data.lateArrivals.length > 0) {
      const lateData = data.lateArrivals.map(l => ({
        'المعرف': l.id,
        'العنوان': l.title,
        'التاريخ': formatDate(l.date),
        'الوقت': l.timeValue,
        'المدة (ساعات)': l.hours || 0,
        'ملاحظات': l.notes || ''
      }));
      const wsLate = XLSX.utils.json_to_sheet(lateData);
      XLSX.utils.book_append_sheet(wb, wsLate, 'إذن التأخير');
    }
    
    // ورقة الملخص
    if (data.summary) {
      const summaryData = [
        ['الإحصائية', 'القيمة'],
        ['إجمالي الإجازات المستهلكة', data.summary.totalLeaveDays],
        ['إجمالي إذن الانصراف (ساعات)', data.summary.totalEarlyHours],
        ['إجمالي إذن التأخير (ساعات)', data.summary.totalLateHours],
        ['الحصيلة النهائية (أيام)', data.summary.netDays],
        ['الخصم من الراتب', data.summary.deductionAmount]
      ];
      const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, wsSummary, 'الملخص');
    }
    
    XLSX.writeFile(wb, `${filename}.xlsx`);
    return true;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return false;
  }
};

export const exportToPDF = async (data, filename) => {
  try {
    const jsPDF = (await import('jspdf')).default;
    const autoTable = (await import('jspdf-autotable')).default;
    
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // العنوان
    doc.setFontSize(18);
    doc.text('Taqreer Ijazati', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Date: ${format(new Date(), 'yyyy-MM-dd')}`, 105, 30, { align: 'center' });
    
    // جدول الإجازات
    if (data.leaves && data.leaves.length > 0) {
      doc.setFontSize(14);
      doc.text('Leaves', 14, 45);
      
      const tableData = data.leaves.map(l => [
        l.title,
        l.typeName,
        formatDate(l.startDate),
        formatDate(l.endDate),
        calculateLeaveDuration(l.startDate, l.endDate).toString(),
        l.notes || '-'
      ]);
      
      autoTable(doc, {
        startY: 50,
        head: [['Title', 'Type', 'Start', 'End', 'Duration', 'Notes']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [124, 58, 237] }
      });
    }
    
    // جدول الانصراف
    if (data.earlyLeaves && data.earlyLeaves.length > 0) {
      doc.setFontSize(14);
      doc.text('Early Leaves', 14, doc.lastAutoTable.finalY + 15);
      
      const tableData = data.earlyLeaves.map(l => [
        l.title,
        formatDate(l.date),
        l.timeValue,
        (l.hours || 0).toString(),
        l.notes || '-'
      ]);
      
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 20,
        head: [['Title', 'Date', 'Time', 'Duration', 'Notes']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] }
      });
    }
    
    // جدول التأخير
    if (data.lateArrivals && data.lateArrivals.length > 0) {
      doc.setFontSize(14);
      doc.text('Late Arrivals', 14, doc.lastAutoTable.finalY + 15);
      
      const tableData = data.lateArrivals.map(l => [
        l.title,
        formatDate(l.date),
        l.timeValue,
        (l.hours || 0).toString(),
        l.notes || '-'
      ]);
      
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 20,
        head: [['Title', 'Date', 'Time', 'Duration', 'Notes']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [245, 158, 11] }
      });
    }
    
    // الملخص
    if (data.summary) {
      doc.setFontSize(14);
      doc.text('Summary', 14, doc.lastAutoTable.finalY + 15);
      
      const summaryData = [
        ['Total Leave Days', data.summary.totalLeaveDays.toString()],
        ['Total Early Hours', `${data.summary.totalEarlyHours} hrs (${data.summary.totalEarlyCount} times)`],
        ['Total Late Hours', `${data.summary.totalLateHours} hrs (${data.summary.totalLateCount} times)`],
        ['Net Days', data.summary.netDays.toString()],
        ['Deduction Amount', `${data.summary.deductionAmount.toFixed(2)} ${data.currency || 'SAR'}`]
      ];
      
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 20,
        body: summaryData,
        theme: 'plain',
        columnStyles: {
          0: { fontStyle: 'bold' }
        }
      });
    }
    
    doc.save(`${filename}.pdf`);
    return true;
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    return false;
  }
};

// توليد معرف فريد
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
