import { memo } from 'react';

function statusMeta(status) {
  const map = {
    new:            { label: 'جديد',         cls: 'bg-blue-50   text-blue-600   border-blue-100'   },
    reviewed:       { label: 'تمت المراجعة',  cls: 'bg-green-50  text-green-600  border-green-100'  },
    pending:        { label: 'قيد المراجعة',  cls: 'bg-amber-50  text-amber-600  border-amber-100'  },
    'under-review': { label: 'قيد المراجعة',  cls: 'bg-amber-50  text-amber-600  border-amber-100'  },
    replied:        { label: 'تم الرد',       cls: 'bg-purple-50 text-purple-600 border-purple-100' },
  };
  return map[status] ?? map.new;
}

const StatusBadge = memo(function StatusBadge({ status }) {
  const { label, cls } = statusMeta(status);
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${cls}`}
    >
      {label}
    </span>
  );
});

export default StatusBadge;