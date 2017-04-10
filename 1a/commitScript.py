import subprocess

def getCommit():
	cmd = "git shortlog -s -n".split(' ') 
	date_arr = ["--since='1 Jun 2016'","--before='1 Jul 2016'"]
	cmd.extend(date_arr)

	commits = subprocess.check_output(cmd)
	commit_arr = commits.decode("utf-8").split("\n")
	author_arr = list(map(lambda x: x.strip(), commit_arr[:-1]))

	return author_arr

def write_csv(author_arr):
	f = open('commit.csv','w')
	line = "commits,author\n"
	f.write(line)
	
	for author in author_arr:
		commit, name = author.split('\t')
		line = commit + ',' + name + '\n'
		f.write(line)
	f.close()

author_arr = getCommit()
write_csv(author_arr)