// دوال التخزين المحلي
export const storeGet = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

export const storeSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Error writing to localStorage:', error);
    return false;
  }
};

export const storeRemove = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing from localStorage:', error);
    return false;
  }
};

// توليد معرف فريد
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// تنسيق التاريخ
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// تنسيق الوقت
export const formatTime = (time) => {
  if (!time) return '';
  return time;
};

// حساب الفرق بين تاريخين بالأيام
export const dateDiffInDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

// حساب ساعات العمل بين وقتين
export const calculateWorkHours = (startTime, endTime, workSettings) => {
  if (!startTime || !endTime) return 0;
  
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  
  if (workSettings.workType === 'single') {
    // فترة واحدة
    const workStart = timeToMinutes(workSettings.singlePeriod.start);
    const workEnd = timeToMinutes(workSettings.singlePeriod.end);
    
    if (start >= workStart && end <= workEnd) {
      return (end - start) / 60;
    }
    return 0;
  } else {
    // فترتين
    const morningStart = timeToMinutes(workSettings.morningPeriod.start);
    const morningEnd = timeToMinutes(workSettings.morningPeriod.end);
    const eveningStart = timeToMinutes(workSettings.eveningPeriod.start);
    const eveningEnd = timeToMinutes(workSettings.eveningPeriod.end);
    
    let hours = 0;
    
    // حساب الفترة الصباحية
    if (start < morningEnd && end > morningStart) {
      const actualStart = Math.max(start, morningStart);
      const actualEnd = Math.min(end, morningEnd);
      if (actualEnd > actualStart) {
        hours += (actualEnd - actualStart) / 60;
      }
    }
    
    // حساب الفترة المسائية
    if (start < eveningEnd && end > eveningStart) {
      const actualStart = Math.max(start, eveningStart);
      const actualEnd = Math.min(end, eveningEnd);
      if (actualEnd > actualStart) {
        hours += (actualEnd - actualStart) / 60;
      }
    }
    
    return hours;
  }
};

// تحويل الوقت إلى دقائق
export const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + (minutes || 0);
};

// تحويل الدقائق إلى وقت
export const minutesToTime = (minutes) => {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

// التحقق من أن التاريخ هو يوم إجازة أسبوعية
export const isWeekend = (date, weekendDays) => {
  const day = new Date(date).getDay();
  // تحويل الأيام لتناسب النظام العربي (الأحد = 0)
  const adjustedDay = day === 0 ? 7 : day;
  return weekendDays.includes(adjustedDay);
};

// الحصول على اسم اليوم
export const getDayName = (date) => {
  const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  return days[new Date(date).getDay()];
};

// حساب الخصم المالي
export const calculateDeduction = (hours, salary, dailyHours) => {
  const daySalary = salary / 30;
  const hourSalary = daySalary / dailyHours;
  return hours * hourSalary;
};

// تحويل الساعات إلى أيام
export const hoursToDays = (hours, dailyHours) => {
  return hours / dailyHours;
};

// التحقق من صحة رقم الهاتف
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

// تنسيق الرقم كعملة
export const formatCurrency = (amount, currency = 'ريال') => {
  return `${amount.toFixed(2)} ${currency}`;
};

// تهيئة البيانات الافتراضية
export const getDefaultSettings = () => ({
  salary: 0,
  currency: 'ريال',
  dailyHours: 8,
  workType: 'single',
  singlePeriod: { start: '08:00', end: '16:00' },
  morningPeriod: { start: '08:00', end: '12:00' },
  eveningPeriod: { start: '16:00', end: '20:00' },
  monthStart: 26,
  monthEnd: 25,
  compensatoryDays: 0,
  weekendDays: [6, 7], // الجمعة والسبت
  rolloverPolicy: 'full',
  balanceCalculationMethod: 'current'
});

export const defaultLeaveTypes = [
  { id: 'annual', name: 'سنوية', deductsFromBalance: true },
  { id: 'unpaid', name: 'بدون راتب', deductsFromBalance: true },
  { id: 'rest', name: 'راحة بالخصم', deductsFromBalance: true },
  { id: 'emergency', name: 'طارئة', deductsFromBalance: false },
  { id: 'sick', name: 'مرضية', deductsFromBalance: false },
  { id: 'mission', name: 'مهمة عمل', deductsFromBalance: false },
  { id: 'official', name: 'عطلة رسمية', deductsFromBalance: false },
  { id: 'marriage', name: 'زواج', deductsFromBalance: false },
  { id: 'birth', name: 'مولود', deductsFromBalance: false },
  { id: 'death', name: 'وفاة', deductsFromBalance: false }
];
