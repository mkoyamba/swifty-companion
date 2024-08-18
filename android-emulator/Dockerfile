# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Dockerfile                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: mkoyamba <mkoyamba@student.s19.be>         +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/08/18 14:56:51 by mkoyamba          #+#    #+#              #
#    Updated: 2024/08/18 15:59:45 by mkoyamba         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

FROM ubuntu:20.04

RUN apt-get update && apt-get install -y android-tools-adb

CMD ["adb", "connect", "127.0.0.1:5555"]