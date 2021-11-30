import './index.scss'

const Post = (props) => (
    <div className="post">
        <div className="title-ctn">
            <p>{props.title} <span>by</span> {props.username}</p>
        </div>
        <div className="content-ctn">
            <p>{props.content}</p>
        </div>
    </div>
)

export default Post