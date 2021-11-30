import React from "react";
import Post from "../Post";
import PostForm from "../PostForm";

import './index.scss'

class App extends React.Component {
    state = {
        posts: [],
        loaded: false,
        error: null,
    }

    fetchPosts = () => {
        this.setState({loaded: false})
        fetch(`${process.env.REACT_APP_BACKEND}/posts`)
            .then(resp => resp.json())
            .then(data => this.setState({
                loaded: true,
                posts: data
            }))
            .catch(error => {
                console.log(error)
                this.setState({ error: 'Could not fetch posts.' })
            })
    }

    componentDidMount() {
        this.fetchPosts()
    }

    render() {
        return (
            <div className="app-ctn">
                <div className="app">
                    <div className="header">
                        <h1 className="title">Flutter<img src="logo.png" /></h1>
                        <p className="subtitle">Short-form Blogging</p>
                    </div>

                    <PostForm postHandler={this.fetchPosts} />

                    {
                        this.state.error ?
                            <div className="error">
                                <h1>Something went wrong. <span onClick={() => window.location.reload()}>Retry</span></h1>
                            </div> :
                            <div className="posts-ctn">
                                <div className="posts">
                                    <h1 className="title">Latest Posts</h1>
                                    {
                                        !this.state.loaded ?
                                            <div className="loading">
                                                <h1>Updating...</h1>
                                            </div> :
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
                    }

                </div>
            </div>
        )
    }
}

export default App