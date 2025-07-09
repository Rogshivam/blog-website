async function toggleFollow(userId) {
    try {
        const response = await fetch(`/toggle-follow/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            const button = document.querySelector('.follow-button');

            button.textContent = data.isFollowing ? 'Following' : 'Follow';
            button.classList.toggle('following', data.isFollowing);

            const followerLabel = [...document.querySelectorAll('.stat-label')]
                .find(label => label.textContent.trim() === "Followers");
            const followerValue = followerLabel?.previousElementSibling;

            if (followerValue) {
                followerValue.textContent = data.followerCount;
            }
        }
    } catch (error) {
        console.error('Error toggling follow:', error);
    }
}
