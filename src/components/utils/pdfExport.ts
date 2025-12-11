import { Project } from '../ProjectContext';

export const exportProjectToPDF = async (project: Project) => {
  // Create a simple HTML representation and print it
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Пожалуйста, разрешите всплывающие окна для экспорта PDF');
    return;
  }

  const htmlContent = generatePDFContent(project);
  
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  // Wait for content to load then print
  printWindow.onload = () => {
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };
};

const generatePDFContent = (project: Project): string => {
  const totalDefects = project.defects.length;
  const fixedDefects = project.defects.filter(d => d.status === 'Исправлен').length;
  const inProgressDefects = project.defects.filter(d => d.status === 'В работе').length;
  const openDefects = project.defects.filter(d => d.status === 'Открыт').length;
  const closedDefects = project.defects.filter(d => d.status === 'Закрыт').length;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${project.name} - Отчет</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 40px;
          color: #333;
        }
        h1 {
          color: #550B14;
          border-bottom: 3px solid #CBC0B2;
          padding-bottom: 10px;
        }
        h2 {
          color: #4A2C21;
          margin-top: 30px;
          border-bottom: 2px solid #CBC0B2;
          padding-bottom: 5px;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .info-row {
          display: flex;
          margin: 10px 0;
        }
        .info-label {
          font-weight: bold;
          width: 150px;
          color: #4A2C21;
        }
        .info-value {
          flex: 1;
        }
        .stats {
          background: #F5F5F5;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .stat-item {
          margin: 8px 0;
          padding: 5px;
        }
        .defect-card {
          border: 1px solid #CBC0B2;
          padding: 15px;
          margin: 15px 0;
          border-radius: 8px;
          page-break-inside: avoid;
        }
        .defect-header {
          font-weight: bold;
          color: #550B14;
          font-size: 1.1em;
          margin-bottom: 10px;
        }
        .defect-detail {
          margin: 5px 0;
          font-size: 0.9em;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          color: #7E6961;
          font-size: 0.9em;
          border-top: 1px solid #CBC0B2;
          padding-top: 20px;
        }
        .photo-section {
          margin-top: 20px;
        }
        .photo-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin-top: 15px;
        }
        .photo-item {
          text-align: center;
        }
        .photo-item img {
          max-width: 100%;
          height: auto;
          border: 1px solid #CBC0B2;
          border-radius: 4px;
        }
        @media print {
          body { margin: 20px; }
          .defect-card { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>FixFlow - Отчет по объекту</h1>
        <p>Дата создания отчета: ${new Date().toLocaleDateString('ru-RU')}</p>
        <p style="color: #7E6961;">ООО "СистемаКонтроля"</p>
      </div>

      <h2>Информация об объекте</h2>
      <div class="info-row">
        <div class="info-label">Название:</div>
        <div class="info-value">${project.name}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Адрес:</div>
        <div class="info-value">${project.address}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Статус:</div>
        <div class="info-value">${project.status}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Менеджер:</div>
        <div class="info-value">${project.manager}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Дата начала:</div>
        <div class="info-value">${project.startDate.toLocaleDateString('ru-RU')}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Прогресс:</div>
        <div class="info-value">${project.progress}%</div>
      </div>
      ${project.description ? `
      <div class="info-row">
        <div class="info-label">Описание:</div>
        <div class="info-value">${project.description}</div>
      </div>
      ` : ''}

      <h2>Статистика дефектов</h2>
      <div class="stats">
        <div class="stat-item">Всего дефектов: <strong>${totalDefects}</strong></div>
        <div class="stat-item">Исправлено: <strong>${fixedDefects}</strong></div>
        <div class="stat-item">В работе: <strong>${inProgressDefects}</strong></div>
        <div class="stat-item">Открыто: <strong>${openDefects}</strong></div>
        <div class="stat-item">Закрыто: <strong>${closedDefects}</strong></div>
      </div>

      ${project.defects.length > 0 ? `
      <h2>Список дефектов</h2>
      ${project.defects.map((defect, index) => `
        <div class="defect-card">
          <div class="defect-header">${index + 1}. ${defect.id} - ${defect.title}</div>
          <div class="defect-detail"><strong>Статус:</strong> ${defect.status}</div>
          <div class="defect-detail"><strong>Приоритет:</strong> ${defect.priority}</div>
          ${defect.assignee ? `<div class="defect-detail"><strong>Ответственный:</strong> ${defect.assignee}</div>` : ''}
          <div class="defect-detail"><strong>Создан:</strong> ${defect.createdAt.toLocaleDateString('ru-RU')}</div>
          <div class="defect-detail"><strong>Обновлен:</strong> ${defect.updatedAt.toLocaleDateString('ru-RU')}</div>
          <div class="defect-detail"><strong>Описание:</strong> ${defect.description}</div>
        </div>
      `).join('')}
      ` : ''}

      ${project.photos.length > 0 ? `
      <div class="photo-section">
        <h2>Фотографии объекта</h2>
        <p>Количество фотографий: ${project.photos.length}</p>
        <div class="photo-grid">
          ${project.photos.map((photo, index) => `
            <div class="photo-item">
              <img src="${photo}" alt="Фото ${index + 1}" />
              <p>Фото ${index + 1}</p>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}

      <div class="footer">
        <p>ООО "СистемаКонтроля" | FixFlow | ${new Date().toLocaleDateString('ru-RU')}</p>
      </div>
    </body>
    </html>
  `;
};
