const user_token = 'YOUR_TOKEN_HERE';

async function scan_repo_details(repo)
{
    try {
        const url = `https://api.github.com/repos${repo}`;

        const response = await fetch(url, {
            headers: {
                'User-Agent':'github-ext-helper/1.0',
                'Authorization': `token ${user_token}`,
                'Accept':'application/vnd.github.v3+json'
            }
        });

        const data = await response.json();

        const starCount = data.stargazers_count;
        const issuesCount = data.open_issues_count;
        const forksCount = data.forks_count;
        const watchersCount = data.subscribers_count;

        const branchesResponse = await fetch(`${url}/branches`, {
            headers: {
                'User-Agent':'github-ext-helper/1.0',
                'Authorization': `token ${user_token}`,
                'Accept':'application/vnd.github.v3+json'
            }
        });

        const branches = await branchesResponse.json();
        const branchesCount = branches.length;

        return {
            star_count: starCount,
            issues_count: issuesCount,
            forks_count: forksCount,
            watchers_count: watchersCount,
            branches_count: branchesCount
        };
    } catch (error) {
        console.error('Error: ', error);
    }
}

async function run()
{
    async function scan_all_repositories(repoLinks) {
        const results = [];
    
        for (const repoLink of repoLinks) {
            try {
                const data = await scan_repo_details(repoLink);
                results.push({
                    repo: repoLink,
                    data: data
                });
            } catch (error) {
                console.error(`Error scanning ${repoLink}:`, error);
            }
        }
    
        return results;
    }

    function scan_repo_list()
    {
        const ol = document.querySelector('ol.d-flex.flex-wrap.list-style-none.gutter-condensed.mb-4');
        
        if (!ol) {
            return { repo_links: [] };
        }
        
        const links = ol.querySelectorAll('a[data-view-component="true"]');
        const repo_links = Array.from(links).map(link => link.getAttribute('href'));
        
        return { repo_links };
    }

    const { repo_links } = scan_repo_list();
    return await scan_all_repositories(repo_links);
}

function main()
{
    function format_num(count)
    {
        if (count >= 100000) {
            return Math.floor(count / 1000) + 'k';
        }
        
        else if (count >= 50000) {
            return (count / 1000).toFixed(1) + 'k';
        }
        
        else if (count >= 1000) {
            return Math.floor(count / 1000) + 'k';
        }
        
        return count.toString();
    }

    run().then(results =>
    {
        document.querySelectorAll('p.mb-0.f6.color-fg-muted').forEach((p, index) =>
        {
            if (results[index])
            {
                const { repo, data } = results[index];

                const star_count = format_num(data.star_count);
                const fork_count = format_num(data.forks_count);
                const branch_count = format_num(data.branches_count);
                const watcher_count = format_num(data.watchers_count);
                const issue_count = format_num(data.issues_count);

                const star_element = document.querySelector(`a[href="${repo}/stargazers"]`);
                if (star_element) {
                    star_element.parentNode.removeChild(star_element);
                }

                const fork_element = document.querySelector(`a[href="${repo}/forks"]`);
                if (fork_element) {
                    fork_element.parentNode.removeChild(fork_element);
                }

                const stars = document.createElement('a');
                stars.setAttribute('href', `${repo}/stargazers`);
                stars.classList.add('Link--muted');
                stars.innerHTML = `
                    <svg aria-label="stars" role="img" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-star">
                        <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z"></path>
                    </svg>
                    ${star_count}
                `;
                    
                p.appendChild(stars);

                const forks = document.createElement('a');
                forks.setAttribute('href', `${repo}/forks`);
                forks.classList.add('Link--muted');
                forks.innerHTML = `
                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-repo-forked ml-1">
                        <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path>
                    </svg>
                    ${fork_count}
                `;
                    
                p.appendChild(forks);

                const branches = document.createElement('a');
                branches.setAttribute('href', `${repo}/branches`);
                branches.classList.add('Link--muted');
                branches.innerHTML = `
                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-git-branch ml-1">
                        <path d="M9.5 3.25a2.25 2.25 0 1 1 3 2.122V6A2.5 2.5 0 0 1 10 8.5H6a1 1 0 0 0-1 1v1.128a2.251 2.251 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.5 0v1.836A2.493 2.493 0 0 1 6 7h4a1 1 0 0 0 1-1v-.628A2.25 2.25 0 0 1 9.5 3.25Zm-6 0a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Zm8.25-.75a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM4.25 12a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z"></path>
                    </svg>
                    ${branch_count}
                `;

                p.appendChild(branches);
                
                const watchers = document.createElement('a');
                watchers.setAttribute('href', `${repo}/watchers`);
                watchers.classList.add('Link--muted');
                watchers.innerHTML = `
                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-eye ml-1">
                        <path d="M8 2c1.981 0 3.671.992 4.933 2.078 1.27 1.091 2.187 2.345 2.637 3.023a1.62 1.62 0 0 1 0 1.798c-.45.678-1.367 1.932-2.637 3.023C11.67 13.008 9.981 14 8 14c-1.981 0-3.671-.992-4.933-2.078C1.797 10.83.88 9.576.43 8.898a1.62 1.62 0 0 1 0-1.798c.45-.677 1.367-1.931 2.637-3.022C4.33 2.992 6.019 2 8 2ZM1.679 7.932a.12.12 0 0 0 0 .136c.411.622 1.241 1.75 2.366 2.717C5.176 11.758 6.527 12.5 8 12.5c1.473 0 2.825-.742 3.955-1.715 1.124-.967 1.954-2.096 2.366-2.717a.12.12 0 0 0 0-.136c-.412-.621-1.242-1.75-2.366-2.717C10.824 4.242 9.473 3.5 8 3.5c-1.473 0-2.825.742-3.955 1.715-1.124.967-1.954 2.096-2.366 2.717ZM8 10a2 2 0 1 1-.001-3.999A2 2 0 0 1 8 10Z"></path>
                    </svg>
                    ${watcher_count}
                `;

                p.appendChild(watchers);
                                
                const issues = document.createElement('a');
                issues.setAttribute('href', `${repo}/issues`);
                issues.classList.add('Link--muted');
                issues.innerHTML = `
                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-issue-opened ml-1">
                        <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
                        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path>
                    </svg>
                    ${issue_count}
                `;

                p.appendChild(issues);
            }
        });
    });
}

main();