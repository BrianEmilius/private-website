const crawl = function (haystack, needle) {
	const pool = [];
	haystack.forEach(element => {
		if (element.title && element.title.toLowerCase().indexOf(needle.toLowerCase()) > -1)
			pool.push(element);
		else if (element.content && element.content.toLowerCase().indexOf(needle.toLowerCase()) > -1)
			pool.push(element);
		else if (element.categories && element.categories.indexOf([needle]) > -1)
			pool.push(element);
		else if (element.tags && element.tags.indexOf([needle]) > -1)
			pool.push(element);
	});
	return pool;
};

const render = function (object) {
	const heading = document.createElement('p');
	heading.setAttribute('class', 'resultTitle');
	const headingLink = document.createElement('a');
	headingLink.setAttribute('href', object.url);
	const headingText = document.createTextNode(object.title);
	headingLink.appendChild(headingText);
	heading.appendChild(headingLink);

	const excerpt = document.createElement('p');
	excerpt.setAttribute('class', 'resultExcerpt');
	const excerptText = document.createTextNode(`${object.content.substring(0, 200)}...`);
	excerpt.appendChild(excerptText);

	const resultBlock = document.createElement('div');
	resultBlock.setAttribute('class', 'resultBlock');
	resultBlock.appendChild(heading);
	resultBlock.appendChild(excerpt);

	return resultBlock;
};

document.addEventListener('DOMContentLoaded', () => {
	const searchInput = document.querySelector('.searchForm input[name=search]');
	const resultDiv = document.querySelector('.searchForm .ajaxSearchResults');

	fetch('/search.json')
		.then(response => response.json())
		.then(docs => {
			searchInput.addEventListener('keyup', () => {
				resultDiv.innerHTML = '';
				if (searchInput.value.length === 0) { resultDiv.innerHTML = ''; return; }
				crawl(docs, searchInput.value).forEach(element => {
					resultDiv.appendChild(render(element));
				});
			});
		});
	
		const disqusOptIn = localStorage.getItem('disqusOptIn');
		const overlay = document.querySelector('.overlay');
		const gdpr = document.querySelector('.gdpr');
		if (disqusOptIn === null) {
			overlay.removeAttribute('hidden');
			gdpr.removeAttribute('hidden');
			const button = document.getElementById('gdpr_save');
			const optIn = document.getElementById('input_disqus');
			button.addEventListener('click', function (){
				if (optIn.checked) {
					localStorage.setItem('disqusOptIn', true);
				} else {
					localStorage.setItem('disqusOptIn', false);
				}
				overlay.setAttribute('hidden', 'hidden');
				gdpr.setAttribute('hidden', 'hidden');
			});
		}
});