import json

file = open("commit_history.out")

line = file.readline()

jsonArray = []

while line != "":
	jsonDataSet = []

	while "NEW_ENTRY" in line or line == "\n":
		line = file.readline()

	currentName = line.rstrip()

	while currentName in line:
		jsonData = {}
		jsonData["name"] = currentName
		jsonData["email"] = file.readline().rstrip()

		line = file.readline()
		token = line.split(", ")
		jsonData["date"] = token[0]
		jsonData["dateAndTime"] = token[1].rstrip()
		line = file.readline()

		if "commitMsgStart" in line:
			line = file.readline()
			message = ""
			while "commitMsgEnd" not in line:
				message = message + line
				line = file.readline()
			jsonData["message"] = message.rstrip()

		line = file.readline()
		add = 0
		delete = 0
		while line != "" and "NEW_ENTRY" not in line:
			if line != "\n":
				line = line.split()
				if (line[0] == "-"):
					line = file.readline()
					continue
				#print (line)
				add += int(line[0])
				delete += int(line[1])
			line = file.readline()
		jsonData["add"] = add
		jsonData["delete"] = delete
		jsonDataSet.append(jsonData)

		while "NEW_ENTRY" in line or line == "\n":
			line = file.readline()
			
		#print (line)
	jsonArray.append(jsonDataSet)
	currentName = line.rstrip()

print (json.dumps(jsonArray))