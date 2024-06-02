package vodzinskiy.backend.mappers;

import org.mapstruct.*;
import vodzinskiy.backend.dto.UserRequest;
import vodzinskiy.backend.models.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "password", ignore = true)
    void updateUserFromUserRequest(UserRequest userRequest, @MappingTarget User user);
}