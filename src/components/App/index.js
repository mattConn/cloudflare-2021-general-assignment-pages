import React from "react";
import Post from "../Post";
import PostForm from "../PostForm";

import './index.scss'

class App extends React.Component {
    state = {
        posts: [],
        postReactions: {},
        loaded: false,
        error: null,
    }

    updateReactions = (title, username, inc) => {
        const postReactions = this.state.postReactions
        postReactions[username][title] += inc
        this.setState({postReactions: postReactions})
    }

    likeHandler = (title, username) => {
        this.updateReactions(title,username,1)
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
                    this.updateReactions(title,username,-1)
                    return resp.text()
                } else {
                    return null
                }
            })
            .then(message => {
                if (message) {
                    throw new Error(message)
                }
            })
            .catch(error => {
                this.updateReactions(title,username,-1)
                console.log(error)
            })
    }

    fetchPosts = () => {
        this.setState({ loaded: false })
        fetch(`${process.env.REACT_APP_BACKEND}/posts`)
            .then(resp => resp.json())
            .then(data => {
                this.setState({
                    posts: data.sort((a,b) => b.likes - a.likes)
                })

                // postReactions schema
                // ====================
                // {
                //     username: {
                //         title: likes,
                //     },
                // }
                const postReactions = {}
                this.state.posts.forEach(post => {
                    if(postReactions.hasOwnProperty(post.username)){
                        postReactions[post.username][post.title] = post.likes
                    } else {
                        postReactions[post.username] = {[post.title]: post.likes} 
                    }
                })
                this.setState({ 
                    postReactions: postReactions,
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
                                    <h1 className="title">Latest Posts</h1>
                                    {
                                        !this.state.loaded ?
                                            <div className="loading">
                                                <h1>Updating...</h1>
                                            </div> :
                                            this.state.posts.map(post => {
                                                const likes = this.state.postReactions[post.username][post.title]
                                                return <Post
                                                    title={post.title}
                                                    username={post.username}
                                                    content={post.content}
                                                    likes={likes}
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