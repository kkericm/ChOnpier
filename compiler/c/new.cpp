// I made this and the "update.exe" because I couldn't compile the JS files directly. 
// So, I chose to do it with C++. There might be a better way to do this, but I did 
// it this way because it's what I know, and I think it will make things easier...

#include <iostream>
#include <string>

using namespace std;

int main() {
    string name, author, description, _name, command = "node ../compiler/generate.js";;
    cout << "< Addon Data >\nname (\"New Addon\"): ";
    getline(cin, name);
    name = name == "" ? "New Addon" : name;
    _name = name;
    cout << "author (\"" << name << " Author\"): ";
    getline(cin, author);
    author = author == "" ? _name.append(" Author") : author;
    cout << "description: ";
    getline(cin, description);

    command.append(" \""); command.append(name); command.append("\" \""); command.append(author); command.append("\" \""); command.append(description); command.append("\"");
    system(command.c_str());
}