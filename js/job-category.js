async function fetchJobData(category) {
    let apiUrl;

    switch (category) {
        case 'internships':
            apiUrl = 'https://rushiscraping.vercel.app/api/v1/getInternships';
            break;
        case 'entry-level':
            apiUrl = 'https://rushiscraping.vercel.app/api/v1/getEntryLeveljobs';
            break;
        case 'freshers':
            apiUrl = 'https://rushiscraping.vercel.app/api/v1/getFresherjobs';
            break;
        case 'experienced':
            apiUrl = 'https://rushiscraping.vercel.app/api/v1/getExperiencedjobs';
            break;
        default:
            console.error('Invalid category:', category);
            return [];
    }

    try {
        document.getElementById('loadingModal').style.display = 'block'; // Show the modal
        console.log(`Fetching data from ${apiUrl}`);
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jobs = await response.json();
        console.log('Fetched jobs:', jobs);
        return jobs;
    } catch (error) {
        console.error('Error fetching job data:', error);
        return [];
    } finally {
        document.getElementById('loadingModal').style.display = 'none'; // Hide the modal
    }
}

function createJobItem(job) {
    const jobItem = document.createElement('div');
    jobItem.classList.add('job-item');
    jobItem.innerHTML = `
        <h3>${job.title}</h3>
        <p>${job.company}</p>
        <span>${job.location}</span>
        <span>${job.posted_on}</span>
    `;
    jobItem.onclick = () => {
        const jobDetailsUrl = new URL('job-details.html', window.location.origin);
        for (const key in job) {
            jobDetailsUrl.searchParams.append(key, job[key]);
        }
        window.location.href = jobDetailsUrl.href;
    };
    return jobItem;
}

async function showJobList(category) {
    console.log('Showing job list for category:', category);
    const jobListSection = document.getElementById('job-list');
    jobListSection.innerHTML = ''; // Clear previous content

    const jobs = await fetchJobData(category);
    if (jobs.length === 0) {
        jobListSection.innerHTML = '<p>No jobs found for this category.</p>';
        return;
    }

    jobs.forEach(job => {
        const jobItem = createJobItem(job);
        jobListSection.appendChild(jobItem);
    });

    // Add event listener for the search button and 'Enter' key
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const locationFilter = document.getElementById('locationFilter');
    const dateFilter = document.getElementById('dateFilter');

    const filterJobs = () => {
        const searchQuery = searchInput.value.toLowerCase();
        const locationQuery = locationFilter.value.toLowerCase();
        const dateQuery = dateFilter.value.toLowerCase();

        const filteredJobs = jobs.filter(job => 
            (job.title.toLowerCase().includes(searchQuery) || 
             job.company.toLowerCase().includes(searchQuery)) &&
            (locationQuery === '' || job.location.toLowerCase().includes(locationQuery)) &&
            (dateQuery === '' || job.posted_on.toLowerCase().includes(dateQuery))
        );

        jobListSection.innerHTML = ''; // Clear previous content
        if (filteredJobs.length === 0) {
            jobListSection.innerHTML = '<p>No jobs found for the search query.</p>';
            return;
        }

        filteredJobs.forEach(job => {
            const jobItem = createJobItem(job);
            jobListSection.appendChild(jobItem);
        });
    };

    searchButton.onclick = filterJobs;
    searchInput.onkeypress = (e) => {
        if (e.key === 'Enter') {
            filterJobs();
        }
    };
    locationFilter.oninput = filterJobs;
    dateFilter.oninput = filterJobs;
}

function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');

    if (category) {
        showJobList(category);
    }
}

document.addEventListener('DOMContentLoaded', init);
