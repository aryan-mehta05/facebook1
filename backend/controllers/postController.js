const { uploadFileToCloudinary, deleteFileFromCloudinary } = require("../config/cloudinary");
const Post = require("../model/Post");
const Story = require("../model/story");
const response = require("../utils/responceHandler");

const createPost = async(req,res) =>{
    try {
        const userId = req.user.userId;
        const {content} = req.body;
        const file = req.file;

        let mediaUrl = null;
        let mediaType = null;
        let mediaPublicId = null;

        if(file) {
            const uploadResult = await uploadFileToCloudinary(file)
            mediaUrl= uploadResult?.secure_url;
            mediaType= file.mimetype.startsWith('video') ? 'video' : 'image';
            mediaPublicId = uploadResult?.public_id;
        }

        //create a new post
        const newPost = await new Post({
            user:userId,
            content,
            mediaUrl,
            mediaType,
            mediaPublicId,
            likeCount:0,
            commentCount:0,
            shareCount:0,
        })

        await newPost.save();
        return response(res,201,'Post created successfully', newPost)

    } catch (error) {
        console.log('error creating post',error)
        return response(res,500, 'Internal server error',error.message)
    }
}

//create story 
const createStory = async(req,res) =>{
    try {
        const userId = req.user.userId;
        const file= req.file;
        
        if(!file) {
            return response(res,400, 'file is required to create a story')
        }

        let mediaUrl = null;
        let mediaType = null;

        if(file) {
            const uploadResult = await uploadFileToCloudinary(file)
            mediaUrl= uploadResult?.secure_url;
            mediaType= file.mimetype.startsWith('video') ? 'video' : 'image';
        }

        //create a new story
        const newStory = await new Story({
            user:userId,
            mediaUrl,
            mediaType
        })

        await newStory.save();
        return response(res,201,'Story created successfully', newStory)

    } catch (error) {
        console.log('error creating story',error)
        return response(res,500, 'Internal server error',error.message)
    }
}

//getAllStory
const getAllStory = async(req, res) => {
    try {
        const story = await Story.find()
        .sort({createdAt: -1})
        .populate('user','_id username profilePicture email')

        return response(res, 201, 'Get all story successfully', story)
    } catch (error) {
        console.log('error getting story',error)
        return response(res,500,'Internal server error',error.message)
    }
}

//get all posts
const getAllPosts = async(req, res) => {
    try {
        const posts = await Post.find()
        .sort({createdAt: -1})
        .populate('user','_id username profilePicture email')
        .populate({
            path: 'comments.user',
            select: 'username profilePicture'
        })
        return response(res, 201, 'Get all posts successfully', posts)
    } catch (error) {
        console.log('error getting posts',error)
        return response(res,500,'Internal server error',error.message)
    }
}

//get post by userId
const getPostByUserId = async(req, res) => {
    const {userId} = req.params;
    
    try {
        if(!userId){
            return response(res,400,'UserId is require to get user post')
        }

        const posts = await Post.find({user:userId})
        .sort({createdAt: -1})
        .populate('user','_id username profilePicture email')
        .populate({
            path: 'comments.user',
            select: 'username, profilePicture'
        })
        return response(res, 201, 'Get user post successfully', posts)
    } catch (error) {
        console.log('error getting posts',error)
        return response(res,500,'Internal server error',error.message)
    }
}

//like post api
const likePost = async(req, res) => {
    const {postId} = req.params;
    const userId= req.user.userId;
    try {
        const post = await Post.findById(postId)
        if(!post) {
            return response(res,404,'post not found')
        }

        const hasLiked = post.likes.includes(userId)
        if(hasLiked) {
            post.likes = post.likes.filter(id => id.toString() !== userId.toString())
            post.likeCount =  Math.max(0, post.likeCount - 1) ; //ensure llikecount does not go negative
        } else {
            post.likes.push(userId)
            post.likeCount += 1
        }

        //save the like in updated post
        const updatedpost = await post.save()
        return response(res, 201, hasLiked ? "Post unlike successfully": "post liked successfully", updatedpost )
    } catch (error) {
        console.log(error)
        return response(res,500,'Internal server error',error.message)
    }
}

//post comments by user
const addCommentToPost = async(req,res) =>{
    const {postId} = req.params;
    const userId= req.user.userId;
    const {text} = req.body;
    try {
        const post = await Post.findById(postId)
        if(!post) {
        return response(res,404,'post not found')
        }

        post.comments.push({user:userId,text})
        post.commentCount+=1;
        
        //save the post with new comments
        await post.save()
        return response(res, 201, "comments added successfully", post )
    } catch (error) {
        console.log(error)
        return response(res,500,'Internal server error',error.message)
    }
}

//share on post by user
const sharePost = async(req, res) => {
    const {postId} = req.params;
    const userId= req.user.userId;
    try {
        const post = await Post.findById(postId)
        if(!post) {
            return response(res,404,'post not found')
        }

        const hasUserShared = post.share.includes(userId)
        if(!hasUserShared){
            post.share.push(userId)
        }

        post.shareCount +=1;

        //save the share in updated post
        await post.save()
        return response(res, 201, 'post share successfully', post )
    } catch (error) {
        console.log(error)
        return response(res,500,'Internal server error',error.message)
    }
}

// Delete a post with role-based access control
const deletePost = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    try {
        // Fetch the post without using .lean()
        const post = await Post.findById(postId);
        if (!post) {
            console.log('Post not found.');
            return res.status(404).json({ message: 'Post not found' });
        }

        // Authorization Check
        if (post.user.toString() !== userId && !['Admin', 'Moderator'].includes(userRole)) {
            console.log('User is not authorized to delete this post.');
            return res.status(403).json({ message: 'You are not authorized to delete this post.' });
        }

        // Delete Media from Cloudinary if it exists
        if (post.mediaPublicId) {
            try {
                const result = await deleteFileFromCloudinary(post.mediaPublicId, post.mediaType);
                console.log(`Media deletion result: ${result.result}`);
                if (result.result !== 'ok') {
                    throw new Error(`Failed to delete media: ${result.result}`);
                }
            } catch (mediaError) {
                console.error('Error deleting media from Cloudinary:', mediaError);
                return res.status(500).json({ message: 'Failed to delete media associated with the post.' });
            }
        }

        // Delete the post using findByIdAndDelete
        const deletedPost = await Post.findByIdAndDelete(postId);
        if (!deletedPost) {
            console.log('Post could not be deleted.');
            return res.status(500).json({ message: 'Failed to delete the post.' });
        }

        console.log('Post deleted successfully.');
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports= {
    createPost,
    getAllPosts,
    getPostByUserId,
    deletePost,
    likePost,
    addCommentToPost,
    sharePost,
    createStory,
    getAllStory
}