// Helper function to parse date strings and check if they are within the last 30 days
function parseDate(dateString) {
    const date = new Date(dateString);
    return isNaN(date) ? new Date() : date;
  }
  
  function isWithinLast30Days(date) {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
    return date >= thirtyDaysAgo;
  }
  
  // Function to get member data
  function scrapeData() {
    const membersActivity = {};
    console.log('Scraping started');
  
    // Update these selectors to match Skool's actual HTML structure
    const posts = document.querySelectorAll('.styled__PostItemWrapper-sc-e4ns84-7');
    console.log(`Found ${posts.length} posts`);
  
    posts.forEach(post => {
      // Update to parse the post date based on Skool's structure
      const postDateText = ''; // Update with correct selector to get date from post
      const postDate = parseDate(postDateText);
      console.log(`Post date: ${postDate}`);
  
      if (!isWithinLast30Days(postDate)) return;
  
      const author = post.querySelector('.styled__UserNameText-sc-24o0l3-1')?.innerText || 'unknown';
      const likes = parseInt(post.querySelector('.styled__LikesCount-sc-e4ns84-3')?.innerText || '0', 10);
  
      if (!membersActivity[author]) {
        membersActivity[author] = { posts: 0, likes: 0, comments: 0 };
      }
      membersActivity[author].posts += 1;
      membersActivity[author].likes += likes;
  
      // Process comments
      const comments = post.querySelectorAll('.styled__CommentItemBubble-sc-1lql1qn-3');
      comments.forEach(comment => {
        const commentAuthor = comment.querySelector('.styled__UserNameText-sc-24o0l3-1')?.innerText || 'unknown';
        const commentLikes = parseInt(comment.querySelector('.styled__VotesLabel-sc-1e3d9on-1')?.innerText || '0', 10);
  
        if (!membersActivity[commentAuthor]) {
          membersActivity[commentAuthor] = { posts: 0, likes: 0, comments: 0 };
        }
        membersActivity[commentAuthor].comments += 1; // Add comments count
        membersActivity[commentAuthor].likes += commentLikes;
      });
    });
  
    // Sorting by activity (posts + comments + likes)
    const sortedMembers = Object.entries(membersActivity)
      .map(([author, activity]) => ({
        author,
        posts: activity.posts,
        likes: activity.likes,
        comments: activity.comments,
        activityScore: activity.posts + activity.comments + activity.likes,
      }))
      .sort((a, b) => b.activityScore - a.activityScore); // Sort by activityScore in descending order
  
    console.log('Sorted members:', sortedMembers);
  
    chrome.storage.local.set({ sortedMembers });
  }
  
  // Use MutationObserver to trigger scraping when content is available
  const observer = new MutationObserver(() => {
    observer.disconnect(); // Stop observing once posts are found
    scrapeData();
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
  
  // Or use a delay if content appears shortly after load
  setTimeout(() => {
    scrapeData();
  }, 3000); // Adjust delay as needed
  