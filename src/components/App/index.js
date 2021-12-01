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

    likeHandler = (title, username) => {
        fetch(`${process.env.REACT_APP_BACKEND}/like`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                username: username
            })
        })
            .then(resp => {
                if (resp.status != 200) {
                    return resp.text()
                } else {
                    this.fetchPosts()
                    return null
                }
            })
            .then(message => {
                if (message) {
                    throw new Error(message)
                }
            })
            .catch(error => {
                console.log(error)
            })
    }

    fetchPosts = () => {
        console.log("${process.env.REACT_APP_BACKEND}/posts",`${process.env.REACT_APP_BACKEND}/posts`)

        fetch(`${process.env.REACT_APP_BACKEND}/posts`)
            .then(resp => resp.json())
            .then(data => {
                this.setState({
                    posts: data.sort((a,b) => b.likes - a.likes),
                    loaded: true
                })
            })
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
                                    <h1 className="title">Most Popular</h1>
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
                                                    likes={post.likes}
                                                    likeHandler={() => this.likeHandler(post.title, post.username)}
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