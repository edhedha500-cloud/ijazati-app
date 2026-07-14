import React, { useState } from 'react';
import { Card, Button, Badge } from './Common';
import { formatDate, getDayName, isWeekend } from '../utils/helpers';

const Calendar = ({ events, onDateClick, settings }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  const dayNames = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const getEventForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.find(e => {
      if (e.type === 'leave') {
        const start = new Date(e.startDate);
        const end = new Date(e.endDate);
        return date >= start && date <= end;
      } else {
        return e.date === dateStr;
      }
    });
  };

  const getEventColor = (event) => {
    if (!event) return null;
    switch (event.type) {
      case 'leave': return '#3b82f6'; // أزرق
      case 'early': return '#f59e0b'; // أصفر
      case 'late': return '#f97316'; // برتقالي
      default: return null;
    }
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();

  const renderDays = () => {
    const days = [];
    
    // أيام الشهر السابق
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} style={{ height: '40px' }} />);
    }

    // أيام الشهر الحالي
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      const event = getEventForDate(date);
      const isToday = date.toDateString() === today.toDateString();
      const weekend = isWeekend(date, settings?.weekendDays || [6, 7]);
      const eventColor = getEventColor(event);

      let bgColor = 'var(--bg-card)';
      let textColor = 'var(--text-primary)';

      if (weekend) {
        bgColor = '#f3f4f6';
        textColor = 'var(--text-muted)';
      }

      if (eventColor) {
        bgColor = eventColor;
        textColor = 'white';
      }

      if (isToday && !eventColor) {
        bgColor = 'var(--primary)';
        textColor = 'white';
      }

      days.push(
        <button
          key={day}
          onClick={() => onDateClick(date)}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: bgColor,
            color: textColor,
            border: 'none',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: isToday || event ? '700' : '500',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            boxShadow: isToday || event ? '0 2px 4px rgba(0,0,0,0.2)' : 'none'
          }}
          onMouseEnter={(e) => {
            if (!isToday && !eventColor) {
              e.target.style.background = 'var(--bg-hover)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isToday && !eventColor) {
              e.target.style.background = bgColor;
            }
          }}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <Card style={{ padding: '16px' }}>
      {/* رأس التقويم */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <Button variant="ghost" size="sm" onClick={prevMonth}>◀</Button>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>
            {monthNames[month]} {year}
          </h3>
        </div>
        <Button variant="ghost" size="sm" onClick={nextMonth}>▶</Button>
      </div>

      {/* أيام الأسبوع */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '4px',
        marginBottom: '8px'
      }}>
        {dayNames.map((day) => (
          <div key={day} style={{
            textAlign: 'center',
            fontSize: '12px',
            fontWeight: '700',
            color: 'var(--text-muted)',
            padding: '8px 0'
          }}>
            {day}
          </div>
        ))}
      </div>

      {/* الأيام */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '4px'
      }}>
        {renderDays()}
      </div>

      {/* زر اليوم */}
      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <Button variant="outline" size="sm" onClick={goToToday}>
          اليوم
        </Button>
      </div>

      {/* مفتاح الألوان */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        marginTop: '16px',
        paddingTop: '16px',
        borderTop: '1px solid var(--border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }} />
          <span>دوام</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3b82f6' }} />
          <span>إجازة</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }} />
          <span>انصراف</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f97316' }} />
          <span>تأخير</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f3f4f6' }} />
          <span>إجازة أسبوعية</span>
        </div>
      </div>
    </Card>
  );
};

const StatCard = ({ title, value, subtitle, gradient, icon }) => {
  return (
    <Card 
      className={gradient}
      style={{
        background: gradient,
        color: 'white',
        padding: '16px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '24px', marginBottom: '8px' }}>{icon}</div>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: '500', opacity: 0.9 }}>
          {title}
        </h3>
        <p style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: '700' }}>
          {value}
        </p>
        {subtitle && (
          <p style={{ margin: 0, fontSize: '11px', opacity: 0.8 }}>
            {subtitle}
          </p>
        )}
      </div>
      <div style={{
        position: 'absolute',
        left: '-20px',
        bottom: '-20px',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.1)'
      }} />
    </Card>
  );
};

const FilterBar = ({ filter, onFilterChange, search, onSearchChange }) => {
  const filters = [
    { id: 'all', label: 'الكل' },
    { id: 'leave', label: 'الإجازات' },
    { id: 'early', label: 'الانصراف' },
    { id: 'late', label: 'التأخير' }
  ];

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '12px',
        flexWrap: 'wrap'
      }}>
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => onFilterChange(f.id)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              background: filter === f.id ? 'var(--primary)' : 'var(--bg-hover)',
              color: filter === f.id ? 'white' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: filter === f.id ? '700' : '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {f.label}
          </button>
        ))}
      </div>
      <input
        type="text"
        placeholder="بحث..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          fontSize: '14px',
          fontFamily: 'var(--font-family)'
        }}
      />
    </div>
  );
};

const FloatingActionButton = ({ isOpen, onToggle, onSelect }) => {
  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '24px',
      zIndex: 90
    }}>
      {isOpen && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginBottom: '12px'
        }}>
          <button
            onClick={() => onSelect('leave')}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px',
              boxShadow: '0 4px 8px rgba(99, 102, 241, 0.3)',
              transition: 'all 0.3s ease',
              animation: 'popIn 0.3s ease'
            }}
          >
            🏖️
          </button>
          <button
            onClick={() => onSelect('early')}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'var(--warning)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px',
              boxShadow: '0 4px 8px rgba(245, 158, 11, 0.3)',
              transition: 'all 0.3s ease',
              animation: 'popIn 0.3s ease'
            }}
          >
            🚶
          </button>
          <button
            onClick={() => onSelect('late')}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'var(--accent)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px',
              boxShadow: '0 4px 8px rgba(249, 115, 22, 0.3)',
              transition: 'all 0.3s ease',
              animation: 'popIn 0.3s ease'
            }}
          >
            ⏰
          </button>
        </div>
      )}
      <button
        onClick={onToggle}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          fontSize: '28px',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
          transition: 'transform 0.3s ease',
          transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        +
      </button>
    </div>
  );
};

export { Calendar, StatCard, FilterBar, FloatingActionButton };
