没有监听事件的时候；

```js
import toTestGesture from "@lib/common/config/toTestGesture";

toTestGesture(document.body);
```

有监听事件的使用这个

```js
import { beginTest, endTest } from "@lib/common/config/toTestGesture/fn";

// 在touchStarrt里使用beginTest

beginTest(e);

// 在touchEnd里使用endTest

endTest(e);
```
