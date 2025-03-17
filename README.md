# 2025 水源家愚人節企劃

## 成員

- 網頁端：`@miyago9267`
- 美術端：`@caryolite`

## 規格

### 劇本JSON Schema

```json
[
  {
    "id": "scene1",
    "background": "room.jpg",
    "dialogues": [
      {
        "character": "Alice",
        "avatar": "alice.png",
        "text": "這裡是什麼地方？"
      },
      {
        "character": "Bob",
        "avatar": "bob.png",
        "text": "這是你的夢境。"
      }
    ],
    "choices": [
      {
        "text": "繼續聽",
        "next": "scene2"
      },
      {
        "text": "醒來",
        "next": "scene3"
      }
    ]
  }
]
```
