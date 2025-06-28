document.addEventListener('DOMContentLoaded', function () {
  const tableBody = document.querySelector('#agenciesTable tbody');

  // جلب قائمة الوكالات
  fetch('https://umrah-api-xxxxx.onrender.com/api/agencies/list')
    .then(res => res.json())
    .then(data => {
      if (data.agencies && Array.isArray(data.agencies)) {
        tableBody.innerHTML = '';
        data.agencies.forEach(agency => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${agency.name}</td>
            <td>${agency.wilaya}</td>
            <td>${agency.license_number}</td>
            <td>${agency.phone}</td>
            <td>${agency.is_approved ? 'مفعلة' : 'بانتظار الموافقة'}</td>
            <td>
              <button class="approve-btn" data-id="${agency.id}" ${agency.is_approved ? 'disabled' : ''}>تفعيل</button>
              <button class="delete-btn" data-id="${agency.id}">حذف</button>
            </td>
          `;
          tableBody.appendChild(tr);
        });
      }
    });

  // تسجيل الخروج
  document.getElementById('logoutBtn').onclick = function() {
    localStorage.removeItem('adminToken');
    window.location.href = 'login.html';
  };

  // الأحداث على أزرار التفعيل والحذف
  tableBody.addEventListener('click', function(e) {
    if (e.target.classList.contains('approve-btn')) {
      const agencyId = e.target.dataset.id;
      fetch(`https://YOUR-API-RENDER-URL/api/agencies/approve/${agencyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      })
        .then(res => res.json())
        .then(data => {
          alert(data.message || 'تم التفعيل');
          location.reload();
        })
        .catch(() => alert('حدث خطأ أثناء التفعيل!'));
    }
    if (e.target.classList.contains('delete-btn')) {
      const agencyId = e.target.dataset.id;
      if (confirm('هل أنت متأكد من حذف الوكالة؟')) {
        fetch(`https://YOUR-API-RENDER-URL/api/agencies/delete/${agencyId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        })
          .then(res => res.json())
          .then(data => {
            alert(data.message || 'تم الحذف');
            location.reload();
          })
          .catch(() => alert('حدث خطأ أثناء الحذف!'));
      }
    }
  });
});
