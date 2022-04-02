const API_KEY = '16a99d40793442078cebca9284841c29';
const element = document.querySelector(".js-choice");
const newsList = document.querySelector('.news-list');
const formSearch = document.querySelector('.form-search');
const titleSearch = document.querySelector('.title-search');

const choices = new Choices(element, {
    searchEnabled: false,
    itemSelectText: '',

});

const getdata = async url => {
    const response = await fetch(url, {
        headers: {
            'X-Api-Key': API_KEY,
        }
    }
    );
    const data = await response.json();
    return data
};
const getDateCorrectFormt = isoDate => {
    const date = new Date(isoDate);
    const fullDate = date.toLocaleString('en-GB', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });
    const fullTime = date.toLocaleString('en-GB', {
        hour: 'numeric',
        minute: 'numeric',
    });
    return `<span class="news-date">${fullDate}</span> ${fullTime}`
}
const getImage = url => new Promise((resolve, reject) => { 
    const image = new Image(270, 200);
    image.addEventListener('load', () => {
        resolve(image)
    });
    image.addEventListener('error', () => {
        image.src = 'img/nofoto.jpg'
        resolve(image)
    }),
    image.src = url||'img/nofoto.jpg'
    image.className = 'news-image';
    
    return image;
})
const renderCard =  (data) => {
    console.log('data', data);
    newsList.textContent = '';
    data.forEach( async news => {
        const { urlToImage, title, url, description, publishedAt, author } = news;
        const card = document.createElement('li');
        card.className = 'news-item';
        const image = await getImage(urlToImage);
        image.alt = 'title';
            card.append(image);
        card.insertAdjacentHTML('beforeend', `
                        <h3 class="news-title">${title}
                        <a href="${url}" class="news-link" target="_blank">${news.title}</a></h3>
                        <p class="news-description">${description || ''};
                        </p>
                        <div class="news-footer">
                            <time class="news-datetime" datetime="${publishedAt}>
                                ${getDateCorrectFormt(publishedAt)}
                            </time>
                        <div class="news-author">${author || ''}</div>
                        </div>
        `);
        newsList.append(card);
    })

}
const loadNews = async () => {
    newsList.innerHTML ='<li class="preload"></li>'
    const country = localStorage.getItem('country')||'en';    
    choices.setChoiceByValue(country)
    const data = await getdata(`https://newsapi.org/v2/top-headlines?country=${country}`);
    renderCard(data.articles);
};

const loadSearch = async value => {
    const data = await getdata(`https://newsapi.org/v2/everything?q=${value}`);
    titleSearch.classList.remove('hide');
    titleSearch.textContent = `Displaying ${data.articles.length} news for "${value}"`
    renderCard(data.articles);
};

element.addEventListener('change', (event) => {
    const value = event.detail.value;
    localStorage.setItem('country', value);
    loadNews();
    


});
formSearch.addEventListener('submit', event => {
    event.preventDefault();
    loadSearch(formSearch.search.value);
    formSearch.reset();
});
loadNews();