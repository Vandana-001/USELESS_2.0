document.addEventListener('DOMContentLoaded', () => {
    const uploadBtn = document.getElementById('uploadBtn');
    const uploadModal = document.getElementById('uploadModal');
    const closeBtn = document.querySelector('.close');
    const uploadForm = document.getElementById('uploadForm');
    const postsContainer = document.getElementById('postsContainer');
    const jumpscareOverlay = document.getElementById('jumpscareOverlay');
    const jumpscareImage = document.getElementById('jumpscareImage');

    // Keep track of which jumpscare image to show next
    let currentJumpscareIndex = 0;

    // Scary versions of animals for jumpscares
    const scarePics = {
        cat: [
            'jumpsacre/js1 (1).jpg',
            'jumpsacre/js1 (2).jpg',
            'jumpsacre/js1 (3).jpg'
        ],
        dog: [
            'jumpsacre/js1 (1).jpg', // Assuming you have different dog jumpscares, update paths if needed
            'jumpsacre/js1 (2).jpg',
            'jumpsacre/js1 (3).jpg'
        ]
    };

    // Function to show jumpscares
    function showJumpscareForType(type) {
        const scaryImages = scarePics[type];
        if (scaryImages && scaryImages.length > 0) {
            // Get the next image in sequence
            jumpscareImage.src = scaryImages[currentJumpscareIndex];
            jumpscareOverlay.style.display = 'flex';

            // Play scary sound
            const scarySound = new Audio('jumpsacre/Creepy animal noise  What the heck IS this_-[AudioTrimmer.com].mp3');
            scarySound.playbackRate = 1.5; // Make the sound play 1.5x faster
            scarySound.play();

            // Hide after a short duration
            setTimeout(() => {
                jumpscareOverlay.style.display = 'none';

                // Move to next image for next jumpscare
                currentJumpscareIndex = (currentJumpscareIndex + 1) % scaryImages.length;
            }, 800);
        }
    }

    // Fun effects array
    const funEffects = [
        { name: 'bounce', animation: 'transform: scale(1.1); transition: transform 0.3s ease;' },
        { name: 'spin', animation: 'transform: rotate(360deg); transition: transform 0.5s ease;' },
        { name: 'shake', animation: 'transform: translateX(5px); transition: transform 0.1s ease;' }
    ];

    // **FIXED:** The misplaced logic is now inside its own async function.
    async function fetchPosts() {
        try {
            // Fetching 5 cat images and 5 dog images
            const [catsResponse, dogsResponse] = await Promise.all([
                fetch('https://api.thecatapi.com/v1/images/search?limit=5'),
                fetch('https://dog.ceo/api/breeds/image/random/5')
            ]);

            const catData = await catsResponse.json();
            const dogData = await dogsResponse.json();
            
            // The Cat API returns an array of objects, Dog CEO returns an array of strings
            const catImages = catData.map(cat => cat.url);
            const dogImages = dogData.message; 

            const posts = [];
            const usernames = ['whiskers_cat', 'pawsome_puppy', 'kitty_corner', 'doge_life', 'fluffycat', 'goodboy'];
            const catCaptions = [
                'Meow-velous day! 😺 #catsofinstagram',
                'Purrfect moment 🐱 #catlife',
                'Living my best nine lives 😸 #catlover',
                'Just cat things 😺 #meow',
                'Nap time is the best time 😴 #catnap'
            ];
            const dogCaptions = [
                'Ready for walkies! 🐕 #dogsofinstagram',
                'Ball is life 🐶 #doglife',
                'Being cute is my job 🐕 #puppy',
                'Who wants treats? 🦮 #goodboy',
                'Adventure time! 🐾 #doggo'
            ];

            // Add cat posts
            catImages.forEach(imageUrl => {
                posts.push({
                    username: usernames[Math.floor(Math.random() * usernames.length)],
                    imageUrl: imageUrl,
                    likes: Math.floor(Math.random() * 200) + 50,
                    caption: catCaptions[Math.floor(Math.random() * catCaptions.length)],
                    type: 'cat' // Added type for easier jumpscare logic
                });
            });

            // Add dog posts
            dogImages.forEach(imageUrl => {
                posts.push({
                    username: usernames[Math.floor(Math.random() * usernames.length)],
                    imageUrl: imageUrl,
                    likes: Math.floor(Math.random() * 200) + 50,
                    caption: dogCaptions[Math.floor(Math.random() * dogCaptions.length)],
                    type: 'dog' // Added type for easier jumpscare logic
                });
            });

            // Shuffle the posts array
            return posts.sort(() => Math.random() - 0.5);
        } catch (error) {
            console.error('Error fetching pet images:', error);
            // Return an empty array or some fallback posts if the API fails
            return []; 
        }
    }

    // Modal functionality
    uploadBtn.addEventListener('click', () => {
        uploadModal.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
        uploadModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === uploadModal) {
            uploadModal.style.display = 'none';
        }
    });

    // Handle image upload
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const fileInput = document.getElementById('imageInput');
        const file = fileInput.files[0];

        if (!file) {
            alert('Please select an image first!');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        // This part requires a backend server to handle the upload.
        // For a frontend-only demo, we can simulate the upload.
        try {
            // Simulating upload by creating a local URL for the image
            const localImageUrl = URL.createObjectURL(file);
            addNewPost({
                username: 'You',
                imageUrl: localImageUrl,
                likes: 0,
                caption: 'My new post!',
                type: 'dog' // Default type for uploads, can be changed
            });
            uploadModal.style.display = 'none';
            uploadForm.reset();

            /*
            // --- REAL UPLOAD CODE (requires a server) ---
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                addNewPost({
                    username: 'You',
                    imageUrl: `/uploads/${data.fileName}`,
                    likes: 0,
                    caption: 'New post!'
                });
                uploadModal.style.display = 'none';
                uploadForm.reset();
            }
            */
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image. Please try again.');
        }
    });

    // Create and add a post to the container
    function addNewPost(post) {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <div class="post-header">
                <img src="https://picsum.photos/32/32" alt="${post.username}">
                <span>${post.username}</span>
            </div>
            <img src="${post.imageUrl}" alt="Post" class="post-image">
            <div class="post-actions">
                <i class="fas fa-heart"></i>
                <i class="fas fa-comment"></i>
                <i class="fas fa-paper-plane"></i>
            </div>
            <div class="post-likes">${post.likes} likes</div>
            <div class="post-caption">${post.caption}</div>
        `;

        // Add fun interactions
        const heartIcon = postElement.querySelector('.fa-heart');
        let isLiked = false;

        heartIcon.addEventListener('click', () => {
            isLiked = !isLiked;
            heartIcon.classList.toggle('liked');
            const likesElement = postElement.querySelector('.post-likes');
            const currentLikes = parseInt(likesElement.textContent);

            if (isLiked) {
                likesElement.textContent = `${currentLikes + 1} likes`;

                // **FIXED:** Simplified jumpscare logic using the 'type' property.
                let animalType = post.type;
                if (!animalType) { // Fallback for older posts without a type
                    const postContent = (post.username.toLowerCase() || '') + ' ' + (post.caption.toLowerCase() || '');
                    animalType = (postContent.includes('cat') || postContent.includes('kitty')) ? 'cat' : 'dog';
                }

                // Show jumpscares
                showJumpscareForType(animalType);

                // Apply random fun effect
                const randomEffect = funEffects[Math.floor(Math.random() * funEffects.length)];
                postElement.style.cssText = randomEffect.animation;
                setTimeout(() => {
                    postElement.style.cssText = '';
                }, 500);
            } else {
                likesElement.textContent = `${currentLikes - 1} likes`;
            }
        });

        // Add hover effects to other icons
        const icons = postElement.querySelectorAll('.post-actions i:not(.fa-heart)');
        icons.forEach(icon => {
            icon.addEventListener('mouseover', () => {
                icon.style.transform = 'scale(1.2)';
                icon.style.transition = 'transform 0.3s ease';
            });

            icon.addEventListener('mouseout', () => {
                icon.style.transform = 'scale(1)';
            });
        });

        postsContainer.insertBefore(postElement, postsContainer.firstChild);
    }

    // **FIXED:** Create an initialization function to load posts from the API.
    async function init() {
        const posts = await fetchPosts();
        posts.forEach(post => addNewPost(post));
    }

    // Run the app
    init();
});