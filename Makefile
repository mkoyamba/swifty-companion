# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: mkoyamba <mkoyamba@student.s19.be>         +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2023/06/06 17:04:20 by mkoyamba          #+#    #+#              #
#    Updated: 2024/08/19 18:02:10 by mkoyamba         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

#          ----------========== {    REGLES    } ==========----------


all: build up

build:
	docker-compose build

up:
	docker-compose up -d
	@printf "\e[0;31m[App started]\n\e[0;m"

clean:
	docker-compose down
	@printf "\e[0;31m[Services ended]\n\e[0;m"

apk:
	cd app && npx eas build --platform android --profile preview --local --output=../app.apk

fclean: clean
	docker rmi $(docker images -q budtmo/docker-android:latest) $(docker images -q adb-service) $(docker images -q react-native)
	@printf "\e[0;31m[All images deleted]\n\e[0;m"

re: fclean all

.PHONY: all build up react-native adb clean fclean re