package vodzinskiy.backend.mapper;

import org.mapstruct.*;
import vodzinskiy.backend.dto.UserRequest;
import vodzinskiy.backend.model.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateUserFromUserRequest(UserRequest userRequest, @MappingTarget User user);
}