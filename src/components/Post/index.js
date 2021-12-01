import './index.scss'

const Post = (props) => (
    <div className="post">
        <div className="title-ctn">
            <p>{props.title} <span>by</span> {props.username}</p>
        </div>
            <div className="content-ctn">
            <p>{props.content}</p>
        </div>
        <p className="likes" onClick={props.likeHandler}><img src="heart.svg"/>{props.likes}</p>
    </div>
)

export default Post