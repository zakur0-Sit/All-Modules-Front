export const showDetails = (title: string, images: string[], texts: string[], altTableContent: string[], prices: string) => {
    const model = document.getElementById('detailsModel') as HTMLDivElement;
    const imageGallery = document.getElementById('imageGallery') as HTMLDivElement;
    const textGallery = document.getElementById('textGallery') as HTMLDivElement;
    const altTable = document.getElementById('altTable') as HTMLDivElement;
    
    if (model && imageGallery && textGallery && altTable) {
        // Set the content here
        // imageGallery.innerHTML = ''; // clear previous images
        images.forEach(image => {
            const img = document.createElement('img');
            img.src = image;
            img.alt = title;
            imageGallery.appendChild(img);
        });

        // textGallery.innerHTML = ''; // clear previous texts
        texts.forEach(text => {
            const p = document.createElement('p');
            p.textContent = text;
            textGallery.appendChild(p);
        });

        // altTable.innerHTML = ''; // clear previous alt table content
        altTableContent.forEach(content => {
            const p = document.createElement('p');
            p.textContent = content;
            altTable.appendChild(p);
        });

        model.style.display = 'block';
    }
};

export const hideDetails = () => {
    const model = document.getElementById('detailsModel') as HTMLDivElement;
    if (model) {
        model.style.display = 'none';
    }
};
