# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: mkoyamba <mkoyamba@student.s19.be>         +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2023/06/06 17:04:20 by mkoyamba          #+#    #+#              #
#    Updated: 2024/08/18 17:23:39 by mkoyamba         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

#          ----------========== {    REGLES    } ==========----------


all: build up
	@printf "\e[0;31m[Emulator started]\n\e[0;m"

build:
	docker-compose build

up:
	docker-compose up -d

app:
	docker-compose run --rm react-native
	@printf "\e[0;31m[App started]\n\e[0;m"

adb:
	docker exec -it adb-container adb devices

clean:
	docker-compose down
	@printf "\e[0;31m[Services ended]\n\e[0;m"

fclean: clean
	docker rmi $(docker images -q budtmo/docker-android:latest) $(docker images -q adb-service) $(docker images -q react-native)
	@printf "\e[0;31m[All images deleted]\n\e[0;m"

re: fclean all

.PHONY: all build up react-native adb clean fclean re