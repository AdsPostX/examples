## What is `APXCarouselPlugin`?

The `APXCarouselPlugin` is a reusable and interactive component that can be seamlessly integrated into your React Native application. 

It provides a carousel made of AdsPostX Offers, allowing you to showcase dynamic and engaging content to your users. 

By leveraging this plugin, you can easily incorporate a visually appealing carousel that enhances the user experience and promotes engagement with the AdsPostX Offers in your React Native app.

## **Integration Steps:**

This guide is designed to help you with the integration of `APXCarouselPlugin`

1. Assuming that you have already set up a react-native environment.
2. Obtain your Native API key from [here](https://docs.adspostx.com/api#Uy6b5).
3. Install the required dependencies.
    
    APXCarouselPlugin depends upon `axios`, `react-native-fast-image`, `react-native-render-html`, `react-native-responsive-fontsize`, `react-native-snap-carousel`, `react-native-webview`.
    
    ```jsx
    npm install -S axios react-native-fast-image react-native-render-html react-native-responsive-fontsize react-native-snap-carousel react-native-webview
    ```
    
4. Download the `APXCarouselPlugin` folder from [here](https://github.com/AdsPostX/examples/tree/main/react-native/APXCarouselDemo). Drag and drop the folder into your React native project.
5. Download [cancel.png](https://github.com/AdsPostX/examples/blob/main/react-native/APXCarouselDemo/assets/cancel.png) and [placeholder.png](https://github.com/AdsPostX/examples/blob/main/react-native/APXCarouselDemo/assets/placeholder.png). Drag and drop those files under `assets` folder in React native project.
6. Go to a file where you want to render `APXCarouselPlugin`
7. Inside the render method copy-paste the following code:
    
    Don’t forget to import `APXCarouselPlugin`.
    
    ```jsx
    <APXCarouselPlugin
                layout={'stack'} // Optional: can be either 'stack','tinder' or 'default'.
                layoutCardOffset={20} // Optional: can be any positive number.
                environment={'live'} // Optional:  can be either 'test' or 'live.
                apiKey={'replace_native_api_key_here'} 
                userAttributes={userAttributes} // Optional: eg. {firstname: 'john', lastname: 'dev'};
                sliderHeight={210} // Optional
                sliderWidth={windowWidth * 0.9} //Optional: if you want to make APXCarouselPlugin responsive to 
    																						//all orientations then don't provide width.
                autoPlay={false} //Optional
                loop={true} //Optional
                autoPlayDelay={2.0} //Optional
                autoPlayLoop={false} //Optional
                showPagination={true} //Optional
                paginationActiveColor={'any_valid_color_value'} //Optional
                paginationDefaultColor={'any_valid_color_value} //Optional
                currentItem={handleCurrentItem} //Optional
                onPressItem={handlePressItem} //Optional
                openLinkIn={'inapp'} // Optional: can be 'inapp' or 'external'
                contentAlignment={'left'} // Optional: can be 'left', 'right' OR 'center'
              />
    ```
    
    ```jsx
    const handleCurrentItem = item => {
        console.log(`currently displayed Item: ${item.title}`);
      };
    
      const handlePressItem = item => {
        console.log(`selected item: ${item.title}`);
      };
    ```
    
    Supported **user attributes** are:
    
    | Attribute Name | Attribute Type |
    | --- | --- |
    | email | string |
    | firstname | string |
    | lastname | string |
    | mobile | string |
    | confirmationref | string |
    | amount | string |
    | currency | string |
    | paymentType | string |
    | ccbin | string |
    | language | string |
    | country | string |
    | zipcode | string |
    | orderid | string |
    
    Other parameter details are as below:
    
    Parameters marked with red color are mandatory parameters.
    
    | Parameter | Value | Description | Default Value |
    | --- | --- | --- | --- |
    | layout | string
    [stack / tinder / default] | describes a layout type for carousel items. | stack |
    | layoutCardOffset | Number | Use to increase or decrease the default card offset in both 'stack' and 'tinder' layouts. | 18 |
    | environment | string (live/test) | has to be either ‘live’ or ‘test. | live |
    | apiKey | string | Native API Key provided to you. |  |
    | userAttributes | dictionary/map | supported user attributes in key-value form. | {} |
    | sliderHeight | double | height of a carousel. | If pagination enabled then 230. 
    If pagination disabled then 210. |
    | sliderWidth | double | width of a carousel. | 80% of screen width. |
    | autoPlay | boolean (true/false) | if true, autoplay carousel items. | false |
    | autoPlayDelay | double | The delay between every page transition in seconds | 2 |
    | autoPlayLoop | boolean (true/false) | Continue playing after reach end | false |
    | showPagination | boolean(true/false) | shows pagination if set to true. | true |
    | paginationActiveColor | valid color value | color for current pagination | ‘black’ |
    | paginationDefaultColor | valid color value | color for all the pagination (except current pagination) | ‘grey’ |
    | currentItem | callback function | Give information about currently displayed item in carousel. |  |
    | onPressItem | callback function | Give information about selected carousel item. |  |
    | openLinkIn | external / inapp | if external : it will open links in external browser.
    if inapp: it will open links in inapp webview.  | external |
    | contentAlignment | left/right/center | content alignment for Offer UI.(title, description, CTA) | center |
    
    **That’s it. Congratulations! You have successfully integrated `APXCarouselPlugin` into your React-Native project.**
    
    
    ## **Q&A:**
    
    1. **What if we want a different layout for the carousel?**
        - In `APXCarouselPlugin` there is a function `renderCarouselItem` which is responsible for rendering carousel item. Implement it as per your requirement.
    2. **What if we want to open a link in inapp webview, not in external browser?**
        - Pass ‘openLinkIn’ = ‘external’ if you want to open a link into an external browser.
        - Pass ‘openLinkIn’ = ‘inapp’ if you want to open a link into inapp webview.
    3. **We want to know when a Carousel Item is pressed.**
        - There is a callback function `onPressItem`, which will give you information about which item is pressed.
    4. **We have a type-script Project, Will this plugin work in type-script project?**
        - Yes
    5. **Does it support all platforms?**
        - It supports iOS and Android.
    6. **I have a list of items (grid view/scroll view), I want to show `APXCarouselPlugin` before/after a list?**
        
        Use `FlatList` to render those items and `FlatList` also has header and footer components where you can show `APXCarouselPlugin` offers.