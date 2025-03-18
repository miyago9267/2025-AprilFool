# 2025 水源家愚人節企劃

## 成員

- 網頁端：`@miyago9267`
- 美術端：`@caryolite`

## 規格

### 劇本JSON Schema

```json
{
  "levels": {
    "level0": {
      "name": "章節名稱",
      "scenes": {
        "scene1": {
          "background": "/images/bg/black.jpg",
          "dialogues": [
            { "character": "", "text": "這是一場冒險這是一場腥風血雨的開始……" },
            { "character": "Alice", "avatar": "/images/chara/01.png", "position": { "x": 20, "y": 65 }, "text": "箱子上鎖了，我們有密碼可以打開它嗎？" },
            { "character": "Bob", "avatar": "/images/chara/02.png", "position": { "x": 80, "y": 65 }, "text": "我來試試看吧！" }
          ],
          "interactions": [
            {
              "type": "input", // input, choice
              "id": "gate-password",
              "placeholder": "密碼是？",
              "correctAnswer": "5678",
              "onSuccess": "scene2",
              "onFailure": "scene3"
            }
          ]
        },
        "scene2": {
          "background": "/images/bg/box.jpg",
          "dialogues": [
            { "character": "Alice", "text": "打開了！" }
          ]
        },
        ,
        "scene3": {
          "background": "/images/bg/box.jpg",
          "dialogues": [
            { "character": "Alice", "text": "白癡！不是這樣啦" }
          ]
        }
      },
      "unlocks": ["level1"]
    }
  }
}
```
