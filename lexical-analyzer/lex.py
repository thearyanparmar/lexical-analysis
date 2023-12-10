    import time

    class IndianTime:
        def __init__(self, msg):
            self.msg = msg

        def displayTime(self):
            print(self.msg)

        def __str__(self):
            print("Indian time object")

    class UsTime:
        def __init__(self, us):
            self.us = us

        def display_usa_time(self):
            print(self.us)


    def show(number):
        ind_obj = IndianTime("2023")
        print(ind_obj.displayTime())

        us_obj = UsTime("2022")
        print(us_obj.display_usa_time())

    show()
    t1 = time.ctime()
    
    t1.display()
    print(time.ctime())
