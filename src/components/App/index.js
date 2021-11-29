import React from "react";
import Post from "../Post";

import './index.scss'

class App extends React.Component {
    state = {
        posts: []
    }

    componentDidMount(){
        fetch(`${process.env.REACT_APP_BACKEND}/posts`)
        .then(resp => resp.json())
        .then(data => this.setState({posts: data}))

    }

    render() {
        return (
            <div className="app">
                <div className="header">
                    <h1>Flutter</h1>
                </div>
                <div className="posts">
                    {
                        this.state.posts.map(post => {
                            return <Post
                                title={post.title}
                                username={post.username}
                                content={post.content}
                            />
                        })
                    }
                </div>

            </div>
        )
    }
}

export default App