package services

import (
	userCliente "users/clients/user"
	"users/dto"
	"users/model"
	e "users/utils/errors"

	"crypto/md5"

	"encoding/hex"

	"github.com/dgrijalva/jwt-go"
	log "github.com/sirupsen/logrus"
)

type userService struct{}

type userServiceInterface interface {
	GetUserById(id int) (dto.UserDto, e.ApiError)
	GetUsers() (dto.UsersDto, e.ApiError)
	InsertUser(userDto dto.UserDto) (dto.UserDto, e.ApiError)
	Login(loginDto dto.LoginDto) (dto.TokenDto, e.ApiError)
}

var (
	UserService userServiceInterface
)

func init() {
	UserService = &userService{}
}

func (s *userService) GetUserById(id int) (dto.UserDto, e.ApiError) {

	var user model.User = userCliente.GetUserById(id)
	var userDto dto.UserDto

	if user.Id == 0 {
		return userDto, e.NewBadRequestApiError("user not found")
	}
	userDto.Name = user.Name
	userDto.LastName = user.LastName
	userDto.UserName = user.UserName
	userDto.Password = user.Password
	userDto.Id = user.Id
	return userDto, nil
}

func (s *userService) GetUsers() (dto.UsersDto, e.ApiError) {

	var users model.Users = userCliente.GetUsers()
	var usersDto dto.UsersDto

	for _, user := range users {
		var userDto dto.UserDto
		userDto.Name = user.Name
		userDto.LastName = user.LastName
		userDto.UserName = user.UserName
		userDto.Password = user.Password
		userDto.Id = user.Id

		usersDto = append(usersDto, userDto)
	}

	return usersDto, nil
}

func (s *userService) InsertUser(userDto dto.UserDto) (dto.UserDto, e.ApiError) {

	var user model.User

	user.Name = userDto.Name
	user.LastName = userDto.LastName
	user.UserName = userDto.UserName

	hash := md5.New()
	hash.Write([]byte(userDto.Password))
	user.Password = hex.EncodeToString(hash.Sum(nil))

	user = userCliente.InsertUser(user)

	userDto.Id = user.Id

	return userDto, nil
}

var jwtKey = []byte("secret_key")

func (s *userService) Login(loginDto dto.LoginDto) (dto.TokenDto, e.ApiError) {

	log.Debug(loginDto)
	var user model.User = userCliente.GetUserByUserName(loginDto.UserName)

	var tokenDto dto.TokenDto

	if user.Id == 0 {
		return tokenDto, e.NewBadRequestApiError("user not found")
	}

	var pswMd5 = md5.Sum([]byte(loginDto.Password))
	pswMd5String := hex.EncodeToString(pswMd5[:])

	if pswMd5String == user.Password {
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"id_user": user.Id,
		})
		tokenString, _ := token.SignedString(jwtKey)
		tokenDto.Token = tokenString
		tokenDto.IdUser = user.Id

		return tokenDto, nil
	} else {
		return tokenDto, e.NewBadRequestApiError("contraseña incorrecta")
	}

}
