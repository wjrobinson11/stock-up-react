import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import config from '../../config';

class Post extends Component {
  constructor(){
    super();
    this.state = {
      liked: false,
      screenWidth: Dimensions.get("window").width
    }
  }

  likeToggled(){
    this.setState({
      liked: !this.state.liked
    })
  }

  render(){
    const imageHeight = Math.floor(this.state.screenWidth * 1.1);
    const imageSelection = (this.props.item%2===0) ? "https://lh3.googleusercontent.com/TlQKphjwCGctp8xC1Gy3F7qqA80DePhErqwVpVVhlbX65tNB3pNk-KobySGYDF-QbAzGLe4B8njWqsqLzwYZ2-yPrQ" : "https://lh3.googleusercontent.com/otuxLktKRRCPGESRKWnt_IhjWc6dl1CkyDzfSf3p-XGhZyxOg5cHFD5qOyPerdQzoBIkPT9LQfW4rWKl-vgsg4xXoA"
    const imageUri = imageSelection +
    "=s" +
    imageHeight +
    "-c";

    const heartIconColor = (this.state.liked) ? 'rgb(252,61,57)' : null

    return(
      <View style={{flex: 1, width: 100+'%'}}>
        <View style={styles.userBar}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              style={styles.userPic}
              source={{
                uri: "https://lh3.googleusercontent.com/ca8fBih-itf5cQKoPA1k8GJNXTxkdxzFd-RHAju-vEeuk2tMOj2dLMRAkkmmZmayrmOphBUEPNhFkPvVca4yMEWW"
              }}
            />
            <Text style={{marginLeft: 10}}>Michael Jordan</Text>
          </View>
          <View style={{alignItems: 'center'}}>
            <Text style={{fontSize: 30}}>...</Text>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={()=>{this.likeToggled()}}
        >
          <Image
            style={{ width: this.state.screenWidth, height: 450 }}
            source={{
              uri: imageUri
            }}
          />
        </TouchableOpacity>
        <View style={styles.iconBar}>
          <Image style={[styles.icon, {width: 35, height: 35, tintColor: heartIconColor}]} source={config.images.heartIcon} />
          <Image style={[styles.icon, {width: 30, height: 30}]} source={config.images.bubbleIcon} />
          <Image style={[styles.icon, {width: 35, height: 35}]} source={config.images.arrowIcon} />
        </View>
        <View style={styles.iconBar}>
          <Image style={[styles.icon, {width: 25, height: 25}]} source={config.images.heartIcon} />
          <Text>128 Likes</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  tempNav: {
    width: 100+'%',
    height: config.styleConstants.rowHeight,
    marginTop: 44,
    backgroundColor: 'rgb(250,250,250)',
    borderColor: config.styleConstants.defaultBorderColor,
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    alignItems: 'center'
  },
  userBar: {
    width: 100+'%',
    height: config.styleConstants.rowHeight,
    backgroundColor: 'rgb(255,255,255)',
    flexDirection: 'row',
    paddingHorizontal: 10,
    justifyContent: 'space-between'
  },
  userPic: {
    height: 40,
    width: 40,
    borderRadius: 20
  },
  iconBar: {
    height: config.styleConstants.rowHeight,
    width: 100+'%',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: config.styleConstants.defaultBorderColor,
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    marginLeft: 5,
  }
});

export default Post
