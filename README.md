```plain
 ____                                   __                      _____      
/\  _`\                  __          __/\ \__           /'\_/`\/\  __`\    
\ \ \L\ \     __    ___ /\_\  _____ /\_\ \ ,_\         /\      \ \ \/\ \   
 \ \ ,  /   /'__`\ /'___\/\ \/\ '__`\/\ \ \ \/  _______\ \ \__\ \ \ \ \ \  
  \ \ \\ \ /\  __//\ \__/\ \ \ \ \L\ \ \ \ \ \_/\______\\ \ \_/\ \ \ \_\ \ 
   \ \_\ \_\ \____\ \____\\ \_\ \ ,__/\ \_\ \__\/______/ \ \_\\ \_\ \_____\
    \/_/\/ /\/____/\/____/ \/_/\ \ \/  \/_/\/__/          \/_/ \/_/\/_____/
                                \ \_\                                      
                                 \/_/                                      
```

## Recipit-MO

## Project Convention
### Environment
1. Java Version : 17
2. Spring Boot Version : v3.5.7
3. Default Encoding : UTF-8
4. Default File System : Windows

### IDE
1. File Encoding
* `File -> Settings -> Editor -> File Encodings -> Project Encoding -> UTF-8`
* `File -> Settings -> Editor -> File Encodings -> Default encoding for properties files -> UTF-8`
2. Lombok Plugin
* `File -> Settings -> Build, Excution, Deployment -> Compiler -> Annotation Processors -> Enable Annotation Processing check`
3. Runtime VM Option
* 민감정보는 구글 드라이브 참조
```properties
 -DSPRING_DATASOURCE_URL={RDB host url}
 -DSPRING_DATASOURCE_USERNAME={RDB username}
 -DSPRING_DATASOURCE_PASSWORD={RDB password}
`-DINTERNAL_AUTH_KEY={internal auth key}
`-Dspring.profiles.active={local / dev / prod}
``` 


### Source
* [GitHub](https://github.com/recipit-manager/recipit-mo)

```bash
git clone https://github.com/recipit-manager/recipit-mo.git 
```

### git 사용자 정보 변경
* git bash 쉘을 이용하여, recipit-mo 루트 디렉토리로 이동 후 아래 명령 실행
```bash
git config --local user.name 본인성명
git config --local user.email 메일주소(GitHub 계정에 등록된 주소)
```
