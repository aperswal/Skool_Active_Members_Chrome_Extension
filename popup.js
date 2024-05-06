document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get('sortedMembers', data => {
    const tbody = document.querySelector('#activity-table tbody');
    const sortedMembers = data.sortedMembers || [];

    sortedMembers.slice(0, 10).forEach((member, index) => {
      const { author, posts, likes } = member;
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${author}</td>
        <td>${posts}</td>
        <td>${likes}</td>
      `;
      tbody.appendChild(row);
    });
  });
});
