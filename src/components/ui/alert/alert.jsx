const alertStyles = {
  success: {
    bg: 'bg-green-100',
    border: 'border-green-400',
    text: 'text-green-700',
    icon: '✅',
  },
  error: {
    bg: 'bg-red-100',
    border: 'border-red-400',
    text: 'text-red-700',
    icon: '❌',
  },
  warning: {
    bg: 'bg-yellow-100',
    border: 'border-yellow-400',
    text: 'text-yellow-700',
    icon: '⚠️',
  },
  info: {
    bg: 'bg-blue-100',
    border: 'border-blue-400',
    text: 'text-blue-700',
    icon: 'ℹ️',
  },
};

const Alert = ({ type = 'info', header = '', message = '' }) => {
  const style = alertStyles[type] || alertStyles.info;

  return (
    <div
      className={`w-full m-6 border-l-4 p-4 rounded-md shadow-sm ${style.bg} ${style.border}`}
      role="alert"
    >
      <div className="flex items-start space-x-3">
        <span className="text-2xl">{style.icon}</span>
        <div>
          {header && <p className={`font-semibold ${style.text}`}>{header}</p>}
          <p className={`mt-1 text-sm ${style.text}`}>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Alert;
